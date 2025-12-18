import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

// ========================================
// DELETE — remove assignment (TEACHER ONLY)
// ========================================
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 🔐 TOKEN CHECK
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Auth required" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Only teachers can delete" }, { status: 403 });
    }

    await prisma.assignment.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// ========================================
// PUT — update assignment (TEACHER ONLY)
// ========================================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 🔐 TOKEN CHECK
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Auth required" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Only teachers can edit" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, dueDate } = body;

    const updated = await prisma.assignment.update({
      where: { id: Number(params.id) },
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
