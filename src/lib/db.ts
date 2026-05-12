import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!.trim();

  // SSL é exigido por hosts gerenciados (Supabase Cloud, Neon, etc.).
  // Para Postgres self-hosted sem TLS, defina DB_REQUIRE_SSL=false
  // (caso contrário o pg falha com "no pg_hba.conf entry").
  const explicit = process.env.DB_REQUIRE_SSL;
  let host = "";
  try {
    host = new URL(connectionString).hostname;
  } catch {
    host = "";
  }
  const isManagedHost =
    host.endsWith(".supabase.co") ||
    host.endsWith(".supabase.com") ||
    host.endsWith(".pooler.supabase.com") ||
    host.endsWith(".neon.tech");
  const useSsl =
    explicit === "true" ? true : explicit === "false" ? false : isManagedHost;

  const adapter = new PrismaPg({
    connectionString,
    max: 1,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
