import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../_lib/prisma";
import { createSubjectSchema } from "../../_lib/validations";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { attendance: true, materials: true } },
      },
    });
    return NextResponse.json(subjects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createSubjectSchema.parse(body);
    const subject = await prisma.subject.create({ data });
    revalidatePath("/", "layout");
    return NextResponse.json(subject, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input", details: error.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}
