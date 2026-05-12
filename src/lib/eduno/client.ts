import { EdunoApiError, isEdunoSuccess } from "./errors";
import type { EdunoBaseResponse } from "@/types/eduno";

const BASE_URL = process.env.EDUNO_API_BASE_URL || "https://ava05.eduno.com.br/api";
const TOKEN = process.env.EDUNO_API_TOKEN || "";

interface RequestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function edunoFetch<T extends EdunoBaseResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    timeout = 10_000,
    retries = 1,
    cache,
    next: nextConfig,
  } = options;

  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "x-token": TOKEN,
    "Content-Type": "application/json",
  };

  const init: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
    ...(cache ? { cache } : {}),
    ...(nextConfig ? { next: nextConfig } : {}),
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const start = Date.now();

    try {
      const response = await fetchWithTimeout(url, init, timeout);
      const duration = Date.now() - start;
      const data = (await response.json()) as T;

      console.log(
        JSON.stringify({
          type: "eduno_api_call",
          endpoint: path,
          method,
          duration_ms: duration,
          status: response.status,
          rc: data.rc,
          success: isEdunoSuccess(data.rc),
          attempt,
        }),
      );

      if (!response.ok) {
        throw new EdunoApiError(
          `Eduno API HTTP ${response.status}`,
          data.rc || "99",
          Array.isArray(data.msg) ? data.msg : data.msg ? [data.msg] : [],
          response.status,
        );
      }

      if (!isEdunoSuccess(data.rc)) {
        throw new EdunoApiError(
          `Eduno API error rc:${data.rc}`,
          data.rc,
          Array.isArray(data.msg) ? data.msg : data.msg ? [data.msg] : [],
          response.status,
        );
      }

      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (error instanceof EdunoApiError) {
        // Erros de negócio (rc != "00") não fazem retry
        throw error;
      }

      if (attempt < retries) {
        // Backoff exponencial antes de retry
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.log(
          JSON.stringify({
            type: "eduno_api_retry",
            endpoint: path,
            attempt: attempt + 1,
            error: lastError.message,
          }),
        );
        continue;
      }
    }
  }

  throw (
    lastError ||
    new EdunoApiError("Eduno API: todas as tentativas falharam", "99")
  );
}
