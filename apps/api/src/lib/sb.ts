import { createClient } from "@supabase/supabase-js";
export const sbAnon = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
export const sbService = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false}});
