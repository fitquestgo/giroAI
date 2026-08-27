"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createStockItem, type CreateStockItemState } from "@/lib/actions";
import {
  stockItemSchema,
  ACCEPTED_PHOTO_TYPES,
  MAX_PHOTO_SIZE_BYTES,
  type FieldErrors,
} from "@/lib/validation";
import { CATEGORY_OPTIONS, OUTRA_CATEGORIA } from "@/lib/categories";

const initialState: CreateStockItemState = { status: "idle" };

type TextFieldName = "nome_produto" | "categoria" | "preco_ou_faixa" | "nome_empresa" | "cidade" | "contato";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const inputClass =
  "mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20";

const selectClass =
  "mt-2 w-full appearance-none rounded-md border border-gray-300 bg-white bg-no-repeat px-4 py-3 pr-10 text-base text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20";

// Seta customizada em SVG inline (data URI) para substituir o chevron nativo do navegador.
const selectChevron = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5l5 5 5-5' stroke='%23525252' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundPosition: "right 0.9rem center",
  backgroundSize: "1rem",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function ProductFormModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [state, formAction, isPending] = useActionState(createStockItem, initialState);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [categoriaSelect, setCategoriaSelect] = useState<string>(CATEGORY_OPTIONS[0]);
  const [categoriaCustom, setCategoriaCustom] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  const isOutra = categoriaSelect === OUTRA_CATEGORIA;

  // Foco inicial + trava de scroll do fundo enquanto o modal está aberto.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      clearTimeout(t);
    };
  }, []);

  // Esc fecha; Tab fica preso dentro do modal (focus trap).
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Sucesso do envio -> avisa o pai, que fecha o modal e atualiza a lista.
  useEffect(() => {
    if (state.status === "success") {
      onSuccess();
    }
  }, [state.status, onSuccess]);

  // Libera a URL do preview da foto ao trocar/desmontar.
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  function validateTextField(name: TextFieldName, value: string) {
    const shape = stockItemSchema.shape[name];
    const result = shape.safeParse(value);
    setClientErrors((prev) => ({
      ...prev,
      [name]: result.success ? undefined : result.error.issues[0]?.message,
    }));
  }

  function validateQuantidade(value: string) {
    const result = stockItemSchema.shape.quantidade.safeParse(value);
    setClientErrors((prev) => ({
      ...prev,
      quantidade: result.success ? undefined : result.error.issues[0]?.message,
    }));
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (photoPreview) URL.revokeObjectURL(photoPreview);

    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      setClientErrors((prev) => ({ ...prev, foto: undefined }));
      return;
    }
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setPhotoPreview(null);
      setClientErrors((prev) => ({
        ...prev,
        foto: "Formato de imagem não suportado (use JPG, PNG ou WEBP).",
      }));
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setPhotoPreview(null);
      setClientErrors((prev) => ({ ...prev, foto: "Imagem muito grande (máximo 5MB)." }));
      return;
    }
    setClientErrors((prev) => ({ ...prev, foto: undefined }));
    setPhotoPreview(URL.createObjectURL(file));
  }

  const errors: FieldErrors = { ...clientErrors, ...state.fieldErrors };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cadastro-modal-title"
        className="my-8 w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="cadastro-modal-title" className="text-xl font-bold tracking-tight text-gray-900">
            Colocar produto pra girar
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 rounded-md p-1 text-gray-700 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form action={formAction} className="mt-5 flex flex-col gap-4">
          <div>
            <label htmlFor="nome_produto" className="text-sm font-medium text-gray-900">
              Nome do produto *
            </label>
            <input
              ref={firstFieldRef}
              id="nome_produto"
              name="nome_produto"
              required
              className={inputClass}
              placeholder="Ex: Camisetas básicas lote misto"
              onBlur={(e) => validateTextField("nome_produto", e.target.value)}
            />
            <FieldError message={errors.nome_produto} />
          </div>

          <div>
            <label htmlFor="categoria_select" className="text-sm font-medium text-gray-900">
              Categoria *
            </label>
            <select
              id="categoria_select"
              value={categoriaSelect}
              onChange={(e) => {
                setCategoriaSelect(e.target.value);
                validateTextField("categoria", e.target.value === OUTRA_CATEGORIA ? categoriaCustom : e.target.value);
              }}
              name={isOutra ? undefined : "categoria"}
              className={selectClass}
              style={selectChevron}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {isOutra ? (
              <input
                name="categoria"
                required
                value={categoriaCustom}
                onChange={(e) => setCategoriaCustom(e.target.value)}
                onBlur={(e) => validateTextField("categoria", e.target.value)}
                className={inputClass}
                placeholder="Qual categoria?"
              />
            ) : null}
            <FieldError message={errors.categoria} />
          </div>

          <div>
            <label htmlFor="quantidade" className="text-sm font-medium text-gray-900">
              Quantidade *
            </label>
            <input
              id="quantidade"
              name="quantidade"
              type="number"
              inputMode="numeric"
              min={1}
              required
              className={inputClass}
              placeholder="Ex: 100"
              onBlur={(e) => validateQuantidade(e.target.value)}
            />
            <FieldError message={errors.quantidade} />
          </div>

          <div>
            <label htmlFor="preco_ou_faixa" className="text-sm font-medium text-gray-900">
              Preço ou faixa de preço *
            </label>
            <input
              id="preco_ou_faixa"
              name="preco_ou_faixa"
              required
              className={inputClass}
              placeholder="Ex: R$ 20 a R$ 35"
              onBlur={(e) => validateTextField("preco_ou_faixa", e.target.value)}
            />
            <FieldError message={errors.preco_ou_faixa} />
          </div>

          <div>
            <label htmlFor="nome_empresa" className="text-sm font-medium text-gray-900">
              Nome da sua empresa *
            </label>
            <input
              id="nome_empresa"
              name="nome_empresa"
              required
              className={inputClass}
              placeholder="Ex: Confecção Bela Vista"
              onBlur={(e) => validateTextField("nome_empresa", e.target.value)}
            />
            <FieldError message={errors.nome_empresa} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="cidade" className="text-sm font-medium text-gray-900">
                Cidade
              </label>
              <input
                id="cidade"
                name="cidade"
                className={inputClass}
                placeholder="Opcional"
                onBlur={(e) => validateTextField("cidade", e.target.value)}
              />
              <FieldError message={errors.cidade} />
            </div>
            <div>
              <label htmlFor="contato" className="text-sm font-medium text-gray-900">
                Contato
              </label>
              <input
                id="contato"
                name="contato"
                className={inputClass}
                placeholder="WhatsApp/e-mail"
                onBlur={(e) => validateTextField("contato", e.target.value)}
              />
              <FieldError message={errors.contato} />
            </div>
          </div>

          <div>
            <label htmlFor="foto" className="text-sm font-medium text-gray-900">
              Foto do produto
            </label>
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-[#525252] file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#2563eb]"
            />
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- preview local via object URL
              <img
                src={photoPreview}
                alt="Pré-visualização da foto"
                className="mt-2 h-28 w-28 rounded-md object-cover"
              />
            ) : null}
            <FieldError message={errors.foto} />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-md bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
          >
            {isPending ? "enviando…" : "cadastrar produto"}
          </button>

          {state.status === "error" && state.message ? (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-600" role="alert">
              {state.message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
