import type { PublicStockItem } from "@/lib/supabase/types";

const NEW_BADGE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

function isRecentlyCreated(iso: string) {
  return Date.now() - new Date(iso).getTime() < NEW_BADGE_WINDOW_MS;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function ProductCard({ item }: { item: PublicStockItem }) {
  const isNew = !item.is_demo && isRecentlyCreated(item.created_at);

  return (
    <li className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative h-36 w-full bg-gray-50">
        {item.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL dinâmica do Supabase Storage
          <img
            src={item.foto_url}
            alt={item.nome_produto}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-400">
              {item.categoria.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-[#1a1a1a]">{item.nome_produto}</h3>
          {item.is_demo ? (
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-[#525252]">
              exemplo
            </span>
          ) : isNew ? (
            <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-medium text-[#2563eb]">
              novo
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-[#525252]">{item.categoria}</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div>
            <dt className="text-xs text-[#525252]">Quantidade</dt>
            <dd className="text-[#1a1a1a]">{item.quantidade}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#525252]">Preço/faixa</dt>
            <dd className="text-[#1a1a1a]">{item.preco_ou_faixa}</dd>
          </div>
        </dl>
        <div className="mt-4 flex items-baseline justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-[#525252]">
          <span className="truncate">
            {item.nome_empresa}
            {item.cidade ? ` · ${item.cidade}` : ""}
          </span>
          <span className="shrink-0">{formatDate(item.created_at)}</span>
        </div>
      </div>
    </li>
  );
}
