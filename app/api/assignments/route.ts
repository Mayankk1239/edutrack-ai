import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

// ========================================
// GET — returns all assignments
// ========================================
export async function GET(req: Request) {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(assignments, { status: 200 });

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load assignments" },
      { status: 500 }
    );
  }
}

// ========================================
// POST — create assignment (AUTH REQUIRED)
// ========================================
export async function POST(req: Request) {
  try {
    // 🔐 TOKEN CHECK
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Auth required" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // ❌ IF USER IS NOT TEACHER
    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Only teachers can create" }, { status: 403 });
    }

    const body = await req.json();

    const newAssignment = await prisma.assignment.create({
      data: {
        title: body.title,
        description: body.description,
        dueDate: new Date(body.dueDate),
      },
    });

    return NextResponse.json(newAssignment, { status: 201 });

  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}
