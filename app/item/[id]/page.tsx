import ItemID from "@/components/item/ItemId";

export default async function ItemIdPage({
  params,
}: {
  params: { id: string };
}) {
  return <ItemID itemId={params.id} />;
}
