import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { updateSettingsSchema } from "../../_lib/validations";

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    return NextResponse.json(settings ?? { id: "singleton", targetAttendance: 75 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { targetAttendance, academicYear } = updateSettingsSchema.parse(body);
    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: { 
        ...(targetAttendance !== undefined && { targetAttendance }),
        ...(academicYear !== undefined && { academicYear })
      },
      create: { 
        id: "singleton", 
        targetAttendance: targetAttendance ?? 75,
        academicYear: academicYear ?? "2025-26"
      },
    });
    return NextResponse.json(settings);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 });
    }
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
