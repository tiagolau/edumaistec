import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dispatchAbandonedCartWebhook } from "@/lib/enrollment/webhook";

export async function GET(request: NextRequest) {
  // Protecao: apenas cron autorizado
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Buscar abandonos entre 1h e 48h atras, nao notificados
  const now = Date.now();
  const oneHourAgo = new Date(now - 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(now - 48 * 60 * 60 * 1000);

  const abandoned = await prisma.enrollmentAttempt.findMany({
    where: {
      status: { in: ["STARTED", "COURSE_SELECTED"] },
      createdAt: {
        gte: fortyEightHoursAgo,
        lte: oneHourAgo,
      },
      recoveryNotified: false,
    },
    take: 50,
  });

  let dispatched = 0;

  for (const attempt of abandoned) {
    await dispatchAbandonedCartWebhook({
      name: attempt.name,
      email: attempt.email,
      phone: attempt.phone,
      courseName: attempt.mainCourseTitle || undefined,
      abandonedAt: attempt.createdAt.toISOString(),
      attemptId: attempt.id,
    });

    await prisma.enrollmentAttempt.update({
      where: { id: attempt.id },
      data: {
        recoveryNotified: true,
        recoveryAt: new Date(),
      },
    });

    dispatched++;
  }

  return NextResponse.json({
    processed: dispatched,
    total: abandoned.length,
  });
}
