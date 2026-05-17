import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTagSchema } from "@/validators/tag";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await db.tag.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("GET /api/tags error:", error);
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
    const data = createTagSchema.parse(body);

    const existing = await db.tag.findFirst({
      where: { name: data.name, userId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Tag already exists" }, { status: 409 });
    }

    const tag = await db.tag.create({
      data: {
        name: data.name,
        color: data.color,
        userId: session.user.id,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("POST /api/tags error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
