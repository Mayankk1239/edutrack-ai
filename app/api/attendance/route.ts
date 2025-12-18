import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

// GET — list all attendance
export async function GET() {
  try {
    const data = await prisma.attendance.findMany({
      orderBy: { date: "desc" }
    });

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST — add attendance (Teacher Only)
export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "Auth required" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Only teachers can mark attendance" }, { status: 403 });
    }

    const body = await req.json();
    const { studentId, date, status } = body;

    const record = await prisma.attendance.create({
      data: {
        studentId: Number(studentId),
        date: new Date(date),
        status
      }
    });

    return NextResponse.json(record, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to add attendance" }, { status: 500 });
  }
}
