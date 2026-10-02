import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rrdhsrcigszwipmhmjhm.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_YLIGDoAyUu4zUKjVX0pIHw_b7Hj9LE4";

  cachedClient = url && anonKey ? createClient(url, anonKey) : null;
  return cachedClient;
}
