import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// DELETE assignment
export async function DELETE(request: NextRequest, context: any) {
  try {
    const id = (await context.params).id;

    const deleted = await prisma.assignment.delete({
      where: { id },
    });

    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// UPDATE assignment
export async function PUT(request: NextRequest, context: any) {
  try {
    const id = (await context.params).id;
    const body = await request.json();

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
