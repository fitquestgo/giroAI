"use client";

import Link from "next/link";

export function HeroSection({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#3a3a3a] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* Abstract circular background elements */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <circle id="circle1" cx="200" cy="150" r="120" />
          <circle id="circle2" cx="800" cy="450" r="100" />
          <circle id="circle3" cx="100" cy="500" r="80" />
        </defs>
        <circle cx="200" cy="150" r="120" fill="none" stroke="#00A89A" strokeWidth="1" opacity="0.08" />
        <circle cx="200" cy="150" r="100" fill="none" stroke="#00A89A" strokeWidth="1" opacity="0.06" />
        <circle cx="200" cy="150" r="80" fill="none" stroke="#00A89A" strokeWidth="1" opacity="0.04" />

        <circle cx="800" cy="450" r="100" fill="none" stroke="#EF3B36" strokeWidth="1" opacity="0.08" />
        <circle cx="800" cy="450" r="80" fill="none" stroke="#EF3B36" strokeWidth="1" opacity="0.06" />

        <circle cx="100" cy="500" r="80" fill="none" stroke="#00A89A" strokeWidth="1" opacity="0.05" />
      </svg>

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center justify-center rounded-full border border-gray-600 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <span className="text-xs font-semibold tracking-wide text-gray-300">
            EXPERIÊNCIA PILOTO · MERCO NOROESTE 2026
          </span>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Estoque parado pode virar negócio.
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-relaxed text-gray-300">
          O Giro AÍ conecta empresas que têm produtos parados a lojistas interessados em novas oportunidades de compra.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onOpenModal}
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-[var(--color-primary-dark)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3a3a3a]"
          >
            Cadastrar meu estoque
          </button>
          <Link
            href="/testar"
            className="inline-flex items-center justify-center rounded-md border border-gray-400 px-6 py-3 text-base font-semibold text-white transition-colors hover:border-gray-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#3a3a3a]"
          >
            Ver oportunidades
          </Link>
        </div>

        {/* Microcopy */}
        <p className="mt-8 text-sm text-gray-400">
          Cadastro rápido · Contato protegido · Você decide com quem negociar
        </p>
      </div>
    </section>
  );
}
