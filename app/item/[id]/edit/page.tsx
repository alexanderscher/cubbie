import ItemIdEdit from "@/components/item/ItemIdEdit";
import { ExtendedItemType, Item } from "@/types/AppTypes";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "next-auth";

const getItemsById = async (id: string) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const item = await prisma.items.findUnique({
    where: {
      receipt: {
        project: {
          userId: userId,
        },
      },
      id: parseInt(id),
    },
    include: {
      receipt: {
        include: {
          project: true,
        },
      },
    },
  });

  return item;
};
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
