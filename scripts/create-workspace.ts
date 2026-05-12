import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { nanoid } from "nanoid";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  const token = nanoid(32);

  const workspace = await prisma.lpWorkspace.create({
    data: {
      name: "Workspace Principal",
      token,
    },
  });

  console.log("Workspace criado com sucesso!");
  console.log(`ID: ${workspace.id}`);
  console.log(`Nome: ${workspace.name}`);
  console.log(`Token: ${token}`);
  console.log(`\nAcesse o admin em:`);
  console.log(`http://localhost:3000/admin?token=${token}`);

  await prisma.$disconnect();
}

main().catch(console.error);
