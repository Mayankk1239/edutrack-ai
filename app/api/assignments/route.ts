import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET all
export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(assignments);

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST new
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const created = await prisma.assignment.create({
      data: {
        title: body.title,
        description: body.description,
        dueDate: new Date(body.dueDate),
      }
    });

    return NextResponse.json(created, { status: 201 });

  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
