import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { readFileSync } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  const buffer = readFileSync("dummy.pdf");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "student-dashboard/test",
        public_id: "test-pdf-file",
        resource_type: "auto",
        use_filename: true,
      },
      (error, result) => {
        if (error) {
          console.error("Error:", error);
          reject(error);
          return;
        }
        
        console.log("--- Cloudinary Upload Result ---");
        console.log("resource_type:", result?.resource_type);
        console.log("format:", result?.format);
        console.log("public_id:", result?.public_id);
        console.log("secure_url:", result?.secure_url);
        console.log("original_filename:", result?.original_filename);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

run().then(() => process.exit(0)).catch(() => process.exit(1));
