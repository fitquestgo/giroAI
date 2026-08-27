"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductFormModal } from "@/components/ProductFormModal";
import type { PublicStockItem } from "@/lib/supabase/types";

export function TestarView({ items }: { items: PublicStockItem[] }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    triggerRef.current?.focus();
  }

  function handleSuccess() {
    setModalOpen(false);
    triggerRef.current?.focus();
    router.refresh();
  }

  const addButtonClass =
    "inline-flex shrink-0 items-center justify-center rounded-md bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2";

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-white">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur">
        <Link
          href="/"
          className="text-sm text-[#525252] hover:text-[#1a1a1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
        >
          ← giro aí
        </Link>
        <button ref={triggerRef} type="button" onClick={openModal} className={addButtonClass}>
          + colocar produto
        </button>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
        <p className="text-sm text-[#525252]">
          {items.length} produto{items.length === 1 ? "" : "s"} girando agora
        </p>

        {items.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-[#525252]">Ainda não há produtos cadastrados.</p>
            <button type="button" onClick={openModal} className={addButtonClass}>
              + colocar produto
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </ul>
        )}
      </main>

      {isModalOpen ? <ProductFormModal onClose={closeModal} onSuccess={handleSuccess} /> : null}
    </div>
  );
}
