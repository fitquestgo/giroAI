"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  ACCEPTED_PHOTO_TYPES,
  MAX_PHOTO_SIZE_BYTES,
  stockItemSchema,
  type FieldErrors,
} from "@/lib/validation";

export type CreateStockItemState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
};

export async function createStockItem(
  _prevState: CreateStockItemState,
  formData: FormData
): Promise<CreateStockItemState> {
  const raw = {
    nome_produto: formData.get("nome_produto")?.toString() ?? "",
    categoria: formData.get("categoria")?.toString() ?? "",
    quantidade: formData.get("quantidade")?.toString() ?? "",
    preco_ou_faixa: formData.get("preco_ou_faixa")?.toString() ?? "",
    nome_empresa: formData.get("nome_empresa")?.toString() ?? "",
    cidade: formData.get("cidade")?.toString() ?? "",
    contato: formData.get("contato")?.toString() ?? "",
  };

  const parsed = stockItemSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FieldErrors;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Confira os campos destacados e tente novamente.",
      fieldErrors,
    };
  }

  const photo = formData.get("foto");
  let fotoUrl: string | null = null;
  let photoWarning: string | undefined;

  const supabase = createServiceSupabaseClient();

  if (photo instanceof File && photo.size > 0) {
    if (!ACCEPTED_PHOTO_TYPES.includes(photo.type)) {
      return {
        status: "error",
        message: "Confira os campos destacados e tente novamente.",
        fieldErrors: { foto: "Formato de imagem não suportado (use JPG, PNG ou WEBP)." },
      };
    }
    if (photo.size > MAX_PHOTO_SIZE_BYTES) {
      return {
        status: "error",
        message: "Confira os campos destacados e tente novamente.",
        fieldErrors: { foto: "Imagem muito grande (máximo 5MB)." },
      };
    }

    const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const path = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("stock-photos")
      .upload(path, photo, { contentType: photo.type, upsert: false });

    if (uploadError) {
      // Não trava o cadastro por causa da foto: segue sem ela.
      photoWarning = "Produto cadastrado, mas a foto não pôde ser enviada.";
    } else {
      const { data: publicUrlData } = supabase.storage.from("stock-photos").getPublicUrl(path);
      fotoUrl = publicUrlData.publicUrl;
    }
  }

  const { error: insertError } = await supabase.from("stock_items").insert({
    nome_produto: parsed.data.nome_produto,
    categoria: parsed.data.categoria,
    quantidade: parsed.data.quantidade,
    preco_ou_faixa: parsed.data.preco_ou_faixa,
    nome_empresa: parsed.data.nome_empresa,
    cidade: parsed.data.cidade || null,
    contato: parsed.data.contato || null,
    foto_url: fotoUrl,
    is_demo: false,
    source: "merco-2026",
  });

  if (insertError) {
    return {
      status: "error",
      message: "Não foi possível salvar seu produto agora. Tente novamente em instantes.",
    };
  }

  revalidatePath("/testar");

  return {
    status: "success",
    message: photoWarning ?? "Produto cadastrado! Ele já aparece na lista.",
  };
}
