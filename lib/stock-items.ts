import { createPublicSupabaseClient } from "@/lib/supabase/client";
import type { PublicStockItem } from "@/lib/supabase/types";

/**
 * Busca a lista pública de produtos. Nunca seleciona a coluna `contato` —
 * a proteção contra exposição de contato de terceiros é feita aqui, no
 * `select` explícito, não apenas confiando na RLS.
 */
export async function getPublicStockItems(): Promise<PublicStockItem[]> {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("stock_items")
    .select(
      "id, nome_produto, categoria, quantidade, preco_ou_faixa, nome_empresa, cidade, foto_url, is_demo, source, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar stock_items:", error.message);
    return [];
  }

  return (data ?? []) as PublicStockItem[];
}
