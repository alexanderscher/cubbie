import ItemIdEdit from "@/components/item/ItemIdEdit";
import { getItemsById } from "@/lib/itemsDB";
import { ExtendedItemType, Item } from "@/types/receiptTypes";

const fetchItem = async (id: string) => {
  const item = await getItemsById(id);
  const returnedItem = {
    ...item,
    edit_image: "",
  };

  return returnedItem as ExtendedItemType;
};

export default async function ItemIdEditPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await fetchItem(params.id);

  return <ItemIdEdit item={item} id={params.id} />;
}
