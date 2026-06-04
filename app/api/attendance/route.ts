import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { createAttendanceSchema } from "../../_lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    const records = await prisma.attendanceRecord.findMany({
      where: subjectId ? { subjectId } : undefined,
      orderBy: { date: "desc" },
      include: {
        subject: { select: { id: true, name: true, color: true } },
      },
    });
    return NextResponse.json(records);
  } catch {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subjectId, date, status, note } = createAttendanceSchema.parse(body);

    // Parse the YYYY-MM-DD date string into a proper Date (midnight UTC)
    const record = await prisma.attendanceRecord.create({
      data: {
        subjectId,
        date: new Date(date + "T00:00:00.000Z"),
        status,
        note: note ?? null,
      },
      include: {
        subject: { select: { id: true, name: true, color: true } },
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input", details: error.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const all = searchParams.get("all");

    if (all === "true") {
      await prisma.attendanceRecord.deleteMany();
      return NextResponse.json({ success: true });
    }

    if (subjectId) {
      await prisma.attendanceRecord.deleteMany({ where: { subjectId } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing subjectId or all parameter" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to delete attendance records" }, { status: 500 });
  }
}
