import { NextResponse } from "next/server";
import { prisma } from "../../../_lib/prisma";

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/materials/[id]">
) {
  try {
    const { id } = await ctx.params;
    await prisma.material.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
