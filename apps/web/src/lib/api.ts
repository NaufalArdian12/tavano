type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export async function api<TResponse, TBody extends Json = Json>(
  path: string,
  token: string | null,
  body?: TBody
) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as TResponse;
}
