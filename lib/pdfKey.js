
export function toS3Key(pdfUrl) {
  if (!pdfUrl || typeof pdfUrl !== "string") return null;

  const value = pdfUrl.trim();
  if (!value) return null;

  if (value.startsWith("http")) {
    try {
      const parsed = new URL(value);
      if (!parsed.hostname.endsWith(".amazonaws.com")) return null;
      const key = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
      return key.startsWith("puck/") ? key : null;
    } catch {
      return null;
    }
  }

  // Already a bare key.
  return value.startsWith("puck/") ? value : null;
}

/** URL of the proxy route that streams the PDF without exposing the bucket. */
export function toSecurePdfUrl(pdfUrl) {
  const key = toS3Key(pdfUrl);
  return key ? `/api/secure-pdf?key=${encodeURIComponent(key)}` : null;
}
