import { sb } from "./supabase";
export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session?.access_token ?? null;
}
export async function registerWithEmail(email: string, password: string) {
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  return data.session?.access_token ?? null; // bisa null (perlu verify), handle di UI
}
export async function logout() {
  await sb.auth.signOut();
}
