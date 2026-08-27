import { getPublicStockItems } from "@/lib/stock-items";
import { TestarView } from "@/components/TestarView";

// A lista de produtos muda com cada cadastro; busca sempre em tempo real
// em vez de servir uma página estática desatualizada.
export const dynamic = "force-dynamic";

export default async function TestarPage() {
  const items = await getPublicStockItems();
  return <TestarView items={items} />;
}
