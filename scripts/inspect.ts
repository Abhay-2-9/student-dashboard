import "dotenv/config";
import { prisma } from "../app/_lib/prisma";

async function inspect() {
  const documents = await prisma.document.findMany({
    where: {
      title: {
        contains: "Academic_Calender_Second_Sem",
      }
    }
  });

  const materials = await prisma.material.findMany({
    where: {
      title: {
        contains: "Academic_Calender_Second_Sem",
      }
    }
  });

  console.log("--- DOCUMENTS ---");
  console.dir(documents, { depth: null });

  console.log("--- MATERIALS ---");
  console.dir(materials, { depth: null });

  process.exit(0);
}

inspect();
