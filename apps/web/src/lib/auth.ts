// src/lib/auth.ts
import { sb } from "./supabase";

export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session?.access_token ?? null;
}

export async function registerWithEmail(email: string, password: string, display_name: string) {
  const { data, error } = await sb.auth.signUp({
    email, password, options: { data: { display_name } }
  });
  if (error) throw error;
  return data.session?.access_token ?? null;
}

/** panggil BFF untuk memastikan row profiles ada & sinkron */
export async function ensureProfile(token: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Gagal sync profile");
}
