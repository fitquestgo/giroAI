import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Client público (chave publishable/anon). Só tem permissão de leitura via RLS.
 * Seguro para uso em Server Components e, se necessário, no client.
 */
export function createPublicSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY em .env.local"
    );
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
