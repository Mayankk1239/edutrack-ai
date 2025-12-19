import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import type { NextRequest } from "next/server";

// DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    await prisma.assignment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// PUT
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const body = await req.json();

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        dueDate: new Date(body.dueDate),
      },
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
