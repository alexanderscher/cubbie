import { auth } from "@/auth";
import ItemID from "@/components/item/ItemId";
import prisma from "@/prisma/client";
import { Item } from "@/types/AppTypes";
import { Session } from "next-auth";

export const getItemsById = async (id: string) => {
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
