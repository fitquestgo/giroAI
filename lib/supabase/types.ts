// Tipagem manual (mínima) da tabela stock_items, suficiente para o escopo da LP.
export type StockItemRow = {
  id: string;
  nome_produto: string;
  categoria: string;
  quantidade: number;
  preco_ou_faixa: string;
  nome_empresa: string;
  cidade: string | null;
  contato: string | null;
  foto_url: string | null;
  is_demo: boolean;
  source: string;
  created_at: string;
};

/** Linha da lista pública: nunca inclui `contato`. */
export type PublicStockItem = Omit<StockItemRow, "contato">;

export type Database = {
  public: {
    Tables: {
      stock_items: {
        Row: StockItemRow;
        Insert: Partial<StockItemRow> &
          Pick<
            StockItemRow,
            | "nome_produto"
            | "categoria"
            | "quantidade"
            | "preco_ou_faixa"
            | "nome_empresa"
          >;
        Update: Partial<StockItemRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
