import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Usa DIRECT_URL para migrations (conexão direta, sem pooler)
    // Em runtime, o Prisma usa DATABASE_URL (com pooler/pgbouncer) definido no schema
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
