import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma 7 + better-sqlite3 use native Node.js modules.
  // Mark them as external so Next.js doesn't try to bundle them.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-better-sqlite3",
    "better-sqlite3",
    "prisma",
  ],
};

export default nextConfig;
