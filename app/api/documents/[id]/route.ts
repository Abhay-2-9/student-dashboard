import { NextResponse } from "next/server";
import { prisma } from "../../../_lib/prisma";

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
