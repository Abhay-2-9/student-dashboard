import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { createMaterialSchema } from "../../_lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");
    const type = searchParams.get("type");

    const materials = await prisma.material.findMany({
      where: {
        ...(subjectId && { subjectId }),
        ...(type && { type }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        subject: { select: { id: true, name: true, color: true } },
      },
    });
    return NextResponse.json(materials);
  } catch {
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createMaterialSchema.parse(body);
    const material = await prisma.material.create({ data });
    return NextResponse.json(material, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input", details: error.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
