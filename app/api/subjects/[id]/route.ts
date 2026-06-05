import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../_lib/prisma";
import { updateSubjectSchema } from "../../../_lib/validations";

export async function PATCH(
  req: Request,
  ctx: RouteContext<"/api/subjects/[id]">
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const data = updateSubjectSchema.parse(body);
    const subject = await prisma.subject.update({ where: { id }, data });
    revalidatePath("/", "layout");
    return NextResponse.json(subject);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 });
    }
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/subjects/[id]">
) {
  try {
    const { id } = await ctx.params;
    // Cascade deletes attendance and materials via Prisma schema
    await prisma.subject.delete({ where: { id } });
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 });
  }
}
