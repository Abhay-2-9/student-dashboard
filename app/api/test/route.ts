import { NextResponse } from "next/server";
import { uploadToCloudinary } from "../../_lib/cloudinary";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const buffer = readFileSync(join(process.cwd(), "dummy.pdf"));
    // Test PDF upload
    const publicUrl = await uploadToCloudinary(buffer, "student-dashboard/test", "test-pdf-raw", true);
    
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
