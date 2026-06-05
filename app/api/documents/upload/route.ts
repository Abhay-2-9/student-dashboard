import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { prisma } from "../../../_lib/prisma";

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg":      "IMAGE",
  "image/png":       "IMAGE",
  "image/gif":       "IMAGE",
  "image/webp":      "IMAGE",
  "image/svg+xml":   "IMAGE",
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file      = formData.get("file") as File | null;
    const title     = formData.get("title") as string | null;

    if (!file || !title) {
      return NextResponse.json({ error: "file and title are required" }, { status: 400 });
    }

    const mimeType = file.type;
    const documentType = ALLOWED_TYPES[mimeType];
    if (!documentType) {
      return NextResponse.json({ error: "Unsupported file type. Upload PDF or image files." }, { status: 415 });
    }

    // Max 50 MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum 50 MB." }, { status: 413 });
    }

    // Write to public/uploads/documents/
    const uploadDir = join(process.cwd(), "public", "uploads", "documents");
    await mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const filePath = join(uploadDir, safeName);
    const buffer   = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/documents/${safeName}`;

    const document = await prisma.document.create({
      data: {
        title,
        type: documentType,
        url: publicUrl,
        fileSize: file.size,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
