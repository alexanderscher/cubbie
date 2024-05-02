import ItemIdEdit from "@/components/item/ItemIdEdit";

export default async function ItemIdEditPage({
  params,
}: {
  params: { id: string };
}) {
  return <ItemIdEdit itemId={params.id} />;
}
