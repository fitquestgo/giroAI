"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProductFormModal } from "@/components/ProductFormModal";
import { useRouter } from "next/navigation";

function Section({
  children,
  bordered = true,
  className = "",
  id = "",
}: {
  children: ReactNode;
  bordered?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`py-16 sm:py-20 ${bordered ? "border-t border-gray-200" : ""} ${className}`}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl">{children}</div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Entrar",
    description: "você acessa a plataforma",
  },
  {
    title: "Informar",
    description: "conta um pouco da sua empresa e informa o que está parado no estoque",
  },
  {
    title: "Analisar",
    description: "o sistema olha para o que você informou e identifica os sinais de baixo giro",
  },
  {
    title: "Descobrir",
    description: "você vê as oportunidades compatíveis com o seu estoque",
  },
  {
    title: "Conectar",
    description: "se houver interesse dos dois lados, a conexão é liberada",
  },
];

const buttonPrimary =
  "inline-flex items-center justify-center rounded-md bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2";

const stepBadge =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary)] text-sm font-semibold text-white";

export default function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  function closeModal() {
    setModalOpen(false);
  }

  function handleSuccess() {
    setModalOpen(false);
    router.refresh();
  }

  return (
    <div className="bg-white">
      <Header onOpenModal={() => setModalOpen(true)} />
      <HeroSection onOpenModal={() => setModalOpen(true)} />
      {/* 1. O problema */}
      <Section bordered={false}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Estoque parado custa dinheiro
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Estoque parado não é só espaço ocupado na prateleira — é dinheiro que já saiu
          do seu bolso e ainda não voltou. Todo lojista tem produto que não gira:
          comprou certo, mas o mercado mudou, a estação passou, ou simplesmente não
          vendeu no ritmo esperado. Enquanto ele fica parado, ele custa.
        </p>
      </Section>

      {/* 2. O que é o Giro AÍ */}
      <Section>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          O que é o Giro AÍ
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          O Giro AÍ conecta lojistas que têm estoque parado a outros negócios
          interessados em comprar esse estoque rápido. Você informa o que está parado,
          o sistema identifica quem pode ter interesse, e a conexão acontece com
          consentimento dos dois lados.
        </p>
      </Section>

      {/* 3. A jornada completa */}
      <Section id="como-funciona">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Como funciona, passo a passo
        </h2>
        <ol className="mt-8 flex flex-col gap-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className={stepBadge}>{index + 1}</span>
              <p className="text-base leading-relaxed text-gray-700">
                <span className="font-semibold text-gray-900">{step.title}</span> —{" "}
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4. Como a análise funciona */}
      <Section>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Nada de caixa-preta
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Cada sugestão que você recebe vem com um motivo. Nada de &ldquo;confie em
          nós&rdquo;: você vê por que aquele item foi identificado como baixo giro —
          tempo parado, quantidade, categoria — e qual é a próxima ação sugerida. A
          decisão final é sempre sua.
        </p>
      </Section>

      {/* 5. Sobre consentimento e conexão */}
      <Section>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Você decide quando falar
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Demonstrar interesse não libera contato automaticamente. A conexão só
          acontece quando as duas empresas confirmam que querem seguir em frente.
          Nenhum contato aparece publicamente antes disso — você decide quando e com
          quem falar.
        </p>
      </Section>

      {/* 6. Fechamento */}
      <Section>
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Seu estoque também pode estar parado por um motivo simples.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Dá uma olhada no que já está circulando por aqui.
          </p>
          <div className="mt-8">
            <Link href="/testar" className={buttonPrimary}>
              ver produtos disponíveis
            </Link>
          </div>
        </div>
      </Section>

      {isModalOpen ? <ProductFormModal onClose={closeModal} onSuccess={handleSuccess} /> : null}
    </div>
  );
}
