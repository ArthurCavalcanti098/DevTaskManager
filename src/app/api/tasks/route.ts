import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTaskSchema, taskQuerySchema } from "@/validators/task";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const query = taskQuerySchema.parse({
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      search: searchParams.get("search") || undefined,
      tagId: searchParams.get("tagId") || undefined,
    });

    const where: Prisma.TaskWhereInput = { userId: session.user.id };

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.tagId) {
      where.tags = { some: { tagId: query.tagId } };
    }

    const tasks = await db.task.findMany({
      where,
      include: { tags: { include: { tag: true } } },
      orderBy: [{ status: "asc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createTaskSchema.parse(body);

    const maxOrder = await db.task.aggregate({
      where: { userId: session.user.id, status: data.status },
      _max: { order: true },
    });

    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        order: (maxOrder._max?.order ?? -1) + 1,
        userId: session.user.id,
        ...(data.tagIds?.length && {
          tags: {
            create: data.tagIds.map((tagId) => ({ tagId })),
          },
        }),
      },
      include: { tags: { include: { tag: true } } },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
