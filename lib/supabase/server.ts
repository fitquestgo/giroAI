import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Client com a chave secreta (equivalente ao service_role). Bypassa RLS.
 * Uso EXCLUSIVO em Server Actions / código de servidor — nunca importar
 * este arquivo de um Client Component.
 */
export function createServiceSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY em .env.local"
    );
  }

  return createClient<Database>(url, secretKey, {
    auth: { persistSession: false },
  });
}
