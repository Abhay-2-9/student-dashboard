import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { readFileSync, writeFileSync } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const pdf = `%PDF-1.4
1 0 obj <</Type/Catalog/Pages 2 0 R>> endobj
2 0 obj <</Type/Pages/Count 1/Kids[3 0 R]>> endobj
3 0 obj <</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>> endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000052 00000 n
0000000101 00000 n
trailer <</Size 4/Root 1 0 R>>
startxref
178
%%EOF`;

writeFileSync('dummy.pdf', pdf);

async function testUpload(resourceType: "raw" | "image" | "auto"): Promise<any> {
  const buffer = readFileSync("dummy.pdf");
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "student-dashboard/test",
        public_id: `test-pdf-${resourceType}`,
        resource_type: resourceType,
        use_filename: true,
      },
      (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function run() {
  try {
    const rawRes = await testUpload("raw");
    console.log("RAW URL:", rawRes.secure_url);
    
    const imgRes = await testUpload("image");
    console.log("IMAGE URL:", imgRes.secure_url);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
