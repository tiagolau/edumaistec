export async function dispatchAbandonedCartWebhook(data: {
  name: string;
  email: string;
  phone: string;
  courseName?: string;
  abandonedAt: string;
  attemptId: string;
}) {
  const webhookUrl = process.env.N8N_ABANDONED_CART_WEBHOOK;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "abandoned_cart",
        timestamp: new Date().toISOString(),
        data,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error(
      `[webhook] Falha ao disparar abandoned_cart para attempt ${data.attemptId}`,
    );
  }
}
