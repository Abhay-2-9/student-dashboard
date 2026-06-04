import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

const SAMPLE_SUBJECTS = [
  { name: "Mathematics", code: "MATH101", color: "#6366f1" },
  { name: "Physics", code: "PHY101", color: "#8b5cf6" },
  { name: "Chemistry", code: "CHEM101", color: "#ec4899" },
  { name: "Computer Science", code: "CS101", color: "#06b6d4" },
  { name: "English", code: "ENG101", color: "#10b981" },
  { name: "History", code: "HIST101", color: "#f59e0b" },
  { name: "Geography", code: "GEO101", color: "#ef4444" },
  { name: "Economics", code: "ECO101", color: "#84cc16" },
  { name: "Biology", code: "BIO101", color: "#f97316" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create Settings singleton
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", targetAttendance: 75 },
  });

  // Create 9 sample subjects (skip if subjects already exist)
  const count = await prisma.subject.count();
  if (count === 0) {
    for (const subject of SAMPLE_SUBJECTS) {
      await prisma.subject.create({ data: subject });
    }
    console.log(`✅ Created ${SAMPLE_SUBJECTS.length} sample subjects`);
  } else {
    console.log(`ℹ️  Skipped seeding subjects — ${count} already exist`);
  }

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
