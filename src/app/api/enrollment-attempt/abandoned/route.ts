import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const since = searchParams.get("since");
  const limit = Math.min(Number(searchParams.get("limit") || "50"), 200);

  const sinceDate = since
    ? new Date(since)
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // padrao: 7 dias

  const attempts = await prisma.enrollmentAttempt.findMany({
    where: {
      status: { in: ["STARTED", "COURSE_SELECTED"] },
      createdAt: { gte: sinceDate },
      recoveryNotified: false,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({
    total: attempts.length,
    data: attempts,
  });
}
