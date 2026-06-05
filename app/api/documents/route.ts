import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { createDocumentSchema } from "../../_lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const documents = await prisma.document.findMany({
      where: {
        ...(type && { type }),
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(documents);
  } catch {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createDocumentSchema.parse(body);
    const document = await prisma.document.create({ data });
    return NextResponse.json(document, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input", details: error.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
