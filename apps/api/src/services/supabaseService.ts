import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createUserClient(userToken: string): SupabaseClient {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${userToken}` } } }
  );
}

export async function saveAttempt(
  sb: SupabaseClient,
  params: { user_id: string; quiz_id: string; answer: string; label: string; feedback: string }
) {
  try {
    await sb.from("attempts").insert(params);
  } catch (e) {
    console.warn("attempts insert failed:", e);
  }
}
