import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Seed command — run explicitly with: npx prisma db seed
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // To migrate to PostgreSQL: update this URL (and .env) to a postgres:// connection string.
    url: env("DATABASE_URL"),
  },
});
