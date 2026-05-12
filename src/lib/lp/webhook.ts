export async function dispatchWebhook(url: string, data: Record<string, unknown>) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "form_submission",
        timestamp: new Date().toISOString(),
        data,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(`Webhook ${url} returned ${response.status}`);
    }
  } catch (err) {
    console.error(`Webhook failed for ${url}:`, err instanceof Error ? err.message : err);
  }
}
