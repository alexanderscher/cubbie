import ItemID from "@/app/components/item/ItemId";
import { getItemsById } from "@/app/lib/itemsDB";
import { Item } from "@/types/receiptTypes";

const fetchItem = async (id: string) => {
  const item = await getItemsById(id);
  console.log(item);
  return item as Item;
};

export default async function ItemIdPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await fetchItem(params.id);
  return (
    <div>
      <ItemID item={item} />
    </div>
  );
}
