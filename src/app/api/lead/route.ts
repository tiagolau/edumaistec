import { NextRequest, NextResponse, after } from "next/server";
import { leadSchema } from "@/lib/validators/lead";
import { prisma } from "@/lib/db";
import { sendCapiEvent, buildFbcFromFbclid } from "@/lib/meta-capi";

type WebhookTarget = { name: string; url: string };

function getWebhookTargets(): WebhookTarget[] {
  const targets: WebhookTarget[] = [];
  const datacrazy = process.env.DATACRAZY_LEAD_WEBHOOK_URL;
  if (datacrazy) targets.push({ name: "datacrazy", url: datacrazy });
  const extra = process.env.EDUMAISTEC_LEAD_WEBHOOK_URL;
  if (extra) targets.push({ name: "extra", url: extra });
  return targets;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido" },
      { status: 400 },
    );
  }

  const result = leadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = result.data;
  const headers = request.headers;
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    null;
  const userAgent = headers.get("user-agent") || null;
  const fbp = request.cookies.get("_fbp")?.value ?? null;
  const fbcCookie = request.cookies.get("_fbc")?.value ?? null;
  const refererForFbclid = headers.get("referer");
  let fbc = fbcCookie;
  if (!fbc && refererForFbclid) {
    try {
      const fbclid = new URL(refererForFbclid).searchParams.get("fbclid");
      fbc = buildFbcFromFbclid(fbclid);
    } catch {
      // ignora
    }
  }
  const eventSourceUrl = refererForFbclid || undefined;

  const utmFields = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "campaign",
  ] as const;
  const utm: Record<string, string> = {};
  const url = new URL(request.url);
  for (const k of utmFields) {
    const v = url.searchParams.get(k);
    if (v) utm[k] = v;
  }
  const referer = headers.get("referer");
  if (referer) {
    try {
      const refUrl = new URL(referer);
      for (const k of utmFields) {
        if (!utm[k]) {
          const v = refUrl.searchParams.get(k);
          if (v) utm[k] = v;
        }
      }
    } catch {
      // ignora referer inválido
    }
  }

  const submission = await prisma.leadSubmission.create({
    data: {
      nome: data.nome,
      email: data.email,
      ddd: data.ddd,
      telefone: data.telefone,
      areaTecnica: data.areaTecnica,
      experienciaMinima: data.experienciaMinima,
      ensinoMedio: data.ensinoMedio,
      source: "hero",
      ip,
      userAgent,
      utm: Object.keys(utm).length ? utm : undefined,
    },
  });

  const payload = {
    event: "lead_submission",
    timestamp: new Date().toISOString(),
    submissionId: submission.id,
    source: "edumaistec-site-hero",
    data,
    utm,
    ip,
    userAgent,
  };

  // after() executa depois da resposta sem matar a função serverless.
  // 1. Dispara Meta CAPI (server-side) com event_id = submission.id pra deduplicar com o Pixel.
  // 2. Dispara webhooks (DataCrazy principal + extra backup).
  const targets = getWebhookTargets();
  after(async () => {
    // Meta CAPI — Lead
    sendCapiEvent({
      eventName: "Lead",
      eventId: submission.id,
      eventSourceUrl,
      user: {
        email: data.email,
        phone: `${data.ddd}${data.telefone}`,
        firstName: data.nome.split(" ")[0],
        ip,
        userAgent,
        fbp,
        fbc,
      },
      customData: {
        content_name: data.areaTecnica,
        content_category: "certificacao-por-competencia",
        ...(Object.keys(utm).length ? { utm } : {}),
      },
    })
      .then((r) => {
        if (!r.ok) {
          console.error(
            JSON.stringify({
              type: "meta_capi_error",
              status: r.status,
              body: r.body,
              submissionId: submission.id,
            }),
          );
        }
      })
      .catch(() => null);
    const results = await Promise.allSettled(
      targets.map(async (t) => {
        try {
          const res = await fetch(t.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            console.error(
              JSON.stringify({
                type: "lead_webhook_error",
                target: t.name,
                status: res.status,
                submissionId: submission.id,
              }),
            );
          }
          return res.ok;
        } catch (err) {
          console.error(
            JSON.stringify({
              type: "lead_webhook_throw",
              target: t.name,
              error: err instanceof Error ? err.message : String(err),
              submissionId: submission.id,
            }),
          );
          return false;
        }
      }),
    );
    const anyOk = results.some(
      (r) => r.status === "fulfilled" && r.value === true,
    );
    await prisma.leadSubmission
      .update({ where: { id: submission.id }, data: { webhookOk: anyOk } })
      .catch(() => null);
  });

  return NextResponse.json({ success: true, id: submission.id });
}
