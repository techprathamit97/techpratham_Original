

interface Bucket {
  count: number;
  /** Epoch ms when the current window resets. */
  resetAt: number;
}

// Keyed by `${identifier}:${bucketName}`.
const store = new Map<string, Bucket>();


const SWEEP_INTERVAL_MS = 60_000;
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;

  remaining: number;

  resetAt: number;
  retryAfter: number;
}

/**
 * Check and consume one unit against a rate limit.
 *
 * @param identifier  Something stable per client, e.g. the client IP.
 * @param bucketName  Namespaces the limit so reads and writes count separately.
 * @param limit       Max requests allowed per window.
 * @param windowMs    Window length in milliseconds.
 */
export function rateLimit(
  identifier: string,
  bucketName: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const key = `${identifier}:${bucketName}`;
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    // Start a fresh window.
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
    retryAfter: 0,
  };
}


export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    // First IP is the original client; the rest are proxies.
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
 