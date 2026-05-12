import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  let body: { name: string; email: string; phone: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { name, email, phone, source } = body;
  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "name, email e phone são obrigatórios" },
      { status: 400 },
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Upsert: se ja tem tentativa com mesmo email nas ultimas 24h, atualiza
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const existing = await prisma.enrollmentAttempt.findFirst({
    where: {
      email: normalizedEmail,
      createdAt: { gte: since },
      status: { not: "PROPOSAL_GENERATED" },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const updated = await prisma.enrollmentAttempt.update({
      where: { id: existing.id },
      data: { name: name.trim(), phone: phone.trim() },
    });
    return NextResponse.json({ id: updated.id });
  }

  const attempt = await prisma.enrollmentAttempt.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      source: source || null,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0] || null,
      userAgent: request.headers.get("user-agent") || null,
    },
  });

  return NextResponse.json({ id: attempt.id }, { status: 201 });
}
