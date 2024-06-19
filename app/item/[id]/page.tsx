import { SearchItemProvider } from "@/components/context/SearchItemContext";
import ItemID from "@/components/item/ItemId";

export default async function ItemIdPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <SearchItemProvider>
      <ItemID />
    </SearchItemProvider>
  );
}
