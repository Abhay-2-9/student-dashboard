import { NextResponse } from "next/server";
import { prisma } from "../../../_lib/prisma";
import { updateAttendanceSchema } from "../../../_lib/validations";

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/attendance/[id]">
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const { date, status, note } = updateAttendanceSchema.parse(body);

    const record = await prisma.attendanceRecord.update({
      where: { id },
      data: {
        ...(date   && { date: new Date(date + "T00:00:00.000Z") }),
        ...(status && { status }),
        ...(note !== undefined && { note }),
      },
    });
    return NextResponse.json(record);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 });
    }
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/attendance/[id]">
) {
  try {
    const { id } = await ctx.params;
    await prisma.attendanceRecord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
