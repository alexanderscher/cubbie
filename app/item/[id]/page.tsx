import ItemID from "@/components/item/ItemId";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getItemsById } from "@/lib/itemsDB";
import { Item } from "@/types/AppTypes";

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
  return <ItemID item={item} />;
}
