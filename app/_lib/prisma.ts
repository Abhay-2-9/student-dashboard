import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Prisma 7 requires a driver adapter — instantiate with better-sqlite3
function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  });
  return new PrismaClient({ adapter });
}

// Singleton pattern for Next.js dev (prevents connection exhaustion during HMR)
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
