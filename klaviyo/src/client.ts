import { getConfig } from './config.ts';

export type RequestOptions = {
  method?: string;
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  revision?: string;
};

/** Error tipado de la API de Klaviyo (incluye status y el array `errors` de la respuesta). */
export class KlaviyoError extends Error {
  status: number;
  errors: unknown;
  constructor(status: number, message: string, errors: unknown) {
    super(message);
    this.name = 'KlaviyoError';
    this.status = status;
    this.errors = errors;
  }
}

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/**
 * Cliente HTTP para la API JSON:API de Klaviyo.
 * - Autenticación con clave privada (`Authorization: Klaviyo-API-Key ...`).
 * - Throttling: respeta un intervalo mínimo entre llamadas (Create Flow permite 1/s).
 * - Reintentos con backoff exponencial ante 429 y 5xx, honrando `Retry-After`.
 */
export class KlaviyoClient {
  apiKey: string;
  baseUrl: string;
  revision: string;
  minIntervalMs: number;
  maxRetries: number;
  #lastRequestAt = 0;

  constructor(opts: {
    apiKey: string;
    baseUrl?: string;
    revision?: string;
    minIntervalMs?: number;
    maxRetries?: number;
  }) {
    this.apiKey = opts.apiKey;
    this.baseUrl = opts.baseUrl ?? 'https://a.klaviyo.com';
    this.revision = opts.revision ?? '2025-07-15';
    // Create Flow tiene burst de 1/s; 1100ms deja margen para no rozar el límite.
    this.minIntervalMs = opts.minIntervalMs ?? 1100;
    this.maxRetries = opts.maxRetries ?? 5;
  }

  static fromEnv(): KlaviyoClient {
    const cfg = getConfig();
    return new KlaviyoClient({ apiKey: cfg.apiKey, revision: cfg.revision });
  }

  async #throttle(): Promise<void> {
    const now = Date.now();
    const wait = this.#lastRequestAt + this.minIntervalMs - now;
    if (wait > 0) await sleep(wait);
    this.#lastRequestAt = Date.now();
  }

  async request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(this.baseUrl + path);
    for (const [k, v] of Object.entries(options.query ?? {})) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }

    const method = (options.method ?? 'GET').toUpperCase();
    const headers: Record<string, string> = {
      Authorization: `Klaviyo-API-Key ${this.apiKey}`,
      revision: options.revision ?? this.revision,
      accept: 'application/json',
    };
    let body: string | undefined;
    if (options.body !== undefined) {
      headers['content-type'] = 'application/json';
      body = JSON.stringify(options.body);
    }

    let attempt = 0;
    for (;;) {
      await this.#throttle();
      const res = await fetch(url, { method, headers, body });

      if ((res.status === 429 || res.status >= 500) && attempt < this.maxRetries) {
        const retryAfter = Number(res.headers.get('retry-after'));
        const backoff =
          Number.isFinite(retryAfter) && retryAfter > 0
            ? retryAfter * 1000
            : Math.min(16000, 1000 * 2 ** attempt);
        attempt++;
        await sleep(backoff);
        continue;
      }

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw new KlaviyoError(
          res.status,
          `HTTP ${res.status} en ${method} ${path}`,
          json?.errors ?? json,
        );
      }
      return json as T;
    }
  }
}
