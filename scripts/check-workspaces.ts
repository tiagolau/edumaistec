import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  const prisma = new PrismaClient({ adapter });

  const workspaces = await prisma.lpWorkspace.findMany();
  console.log("Workspaces encontrados:", workspaces.length);
  for (const ws of workspaces) {
    console.log(`  ID: ${ws.id}`);
    console.log(`  Nome: ${ws.name}`);
    console.log(`  Token: ${ws.token}`);
    console.log(`  Ativo: ${ws.active}`);
    console.log("---");
  }

  await prisma.$disconnect();
}

main().catch(console.error);
