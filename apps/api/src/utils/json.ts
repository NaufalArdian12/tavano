export function safeJsonParse<T = unknown>(s: string, fallback: T): T {
  try { return JSON.parse(s) as T; } catch { return fallback; }
}
