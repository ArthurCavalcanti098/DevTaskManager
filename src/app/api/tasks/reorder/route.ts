import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reorderTasksSchema } from "@/validators/task";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = reorderTasksSchema.parse(body);

    const taskIds = data.tasks.map((t) => t.id);

    const existingTasks = await db.task.findMany({
      where: { id: { in: taskIds }, userId: session.user.id },
      select: { id: true },
    });

    if (existingTasks.length !== taskIds.length) {
      return NextResponse.json(
        { error: "Uma ou mais tarefas nao pertencem ao usuario" },
        { status: 403 },
      );
    }

    await db.$transaction(
      data.tasks.map((task) =>
        db.task.update({
          where: { id: task.id },
          data: { status: task.status, order: task.order },
        }),
      ),
    );

    const updatedTasks = await db.task.findMany({
      where: { userId: session.user.id },
      include: { tags: { include: { tag: true } } },
      orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(updatedTasks);
  } catch (error) {
    console.error("PATCH /api/tasks/reorder error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
