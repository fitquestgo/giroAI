import { z } from "zod";

/**
 * Schema compartilhado entre o formulário (client) e a Server Action (server).
 * A foto é validada separadamente (é um File, tratado à parte no upload).
 */
export const stockItemSchema = z.object({
  nome_produto: z
    .string()
    .trim()
    .min(2, "Informe o nome do produto.")
    .max(120, "Nome do produto muito longo."),
  categoria: z
    .string()
    .trim()
    .min(2, "Informe a categoria.")
    .max(60, "Categoria muito longa."),
  quantidade: z.coerce
    .number({ message: "Informe uma quantidade válida." })
    .int("Quantidade deve ser um número inteiro.")
    .positive("Quantidade deve ser maior que zero."),
  preco_ou_faixa: z
    .string()
    .trim()
    .min(1, "Informe o preço ou uma faixa de preço.")
    .max(60, "Preço/faixa muito longo."),
  nome_empresa: z
    .string()
    .trim()
    .min(2, "Informe o nome da empresa.")
    .max(120, "Nome da empresa muito longo."),
  cidade: z
    .string()
    .trim()
    .max(80, "Cidade muito longa.")
    .optional()
    .or(z.literal("")),
  contato: z
    .string()
    .trim()
    .max(120, "Contato muito longo.")
    .optional()
    .or(z.literal("")),
});

export type StockItemInput = z.infer<typeof stockItemSchema>;

export const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type FieldErrors = Partial<Record<keyof StockItemInput | "foto", string>>;
