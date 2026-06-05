const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const buffer = fs.readFileSync('dummy.pdf');

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
      process.exit(1);
    }
    
    console.log("--- Cloudinary Upload Result ---");
    console.log("resource_type:", result.resource_type);
    console.log("format:", result.format);
    console.log("public_id:", result.public_id);
    console.log("secure_url:", result.secure_url);
    console.log("original_filename:", result.original_filename);
    process.exit(0);
  }
);
stream.end(buffer);
