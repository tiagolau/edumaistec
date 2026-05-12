import { createHash } from "crypto";

const GRAPH_API_VERSION = "v22.0";

type UserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  ip?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
};

type CustomData = Record<string, unknown>;

type CapiEventInput = {
  eventName: string;
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  actionSource?: "website" | "email" | "app" | "phone_call" | "other";
  testEventCode?: string;
  user: UserData;
  customData?: CustomData;
};

function sha256(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  // Assume Brasil (55) se vier sem código do país
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  return `55${digits}`;
}

export async function sendCapiEvent(input: CapiEventInput): Promise<{
  ok: boolean;
  status: number;
  body?: unknown;
}> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    return { ok: false, status: 0, body: { error: "CAPI not configured" } };
  }

  const user_data: Record<string, unknown> = {};
  if (input.user.email) user_data.em = [sha256(input.user.email)];
  if (input.user.phone) user_data.ph = [sha256(normalizePhone(input.user.phone))];
  if (input.user.firstName) user_data.fn = [sha256(input.user.firstName)];
  if (input.user.ip) user_data.client_ip_address = input.user.ip;
  if (input.user.userAgent) user_data.client_user_agent = input.user.userAgent;
  if (input.user.fbp) user_data.fbp = input.user.fbp;
  if (input.user.fbc) user_data.fbc = input.user.fbc;

  const event = {
    event_name: input.eventName,
    event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    action_source: input.actionSource ?? "website",
    ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
    user_data,
    ...(input.customData ? { custom_data: input.customData } : {}),
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`;

  const body: Record<string, unknown> = { data: [event] };
  if (input.testEventCode) body.test_event_code = input.testEventCode;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let parsed: unknown = null;
    try {
      parsed = await res.json();
    } catch {
      // ignora
    }
    return { ok: res.ok, status: res.status, body: parsed };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      body: { error: err instanceof Error ? err.message : String(err) },
    };
  }
}

export function buildFbcFromFbclid(
  fbclid: string | null | undefined,
  ts = Date.now(),
): string | null {
  if (!fbclid) return null;
  return `fb.1.${ts}.${fbclid}`;
}
