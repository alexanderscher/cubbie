"use server";
import { deleteItem } from "@/actions/items/deleteItem";
import { markAsReturned, unreturn } from "@/actions/items/return";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";

export const returnSelectedItems = async (itemIds: number[]) => {
  try {
    for (const id of itemIds) {
      await markAsReturned(id);
    }
  } catch (err) {
    console.error(err);
  }
};

export const unreturnSelectedItems = async (itemIds: number[]) => {
  try {
    for (const id of itemIds) {
      await unreturn(id);
    }
  } catch (err) {
    console.error(err);
  }
};

export const returnAllItems = async (searchParam: string) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  try {
    const items = await prisma.items.findMany({
      where: {
        OR: [
          {
            receipt: {
              project: {
                userId: userId,
              },
            },
          },
          {
            receipt: {
              project: {
                projectUsers: { some: { userId } },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        returned: true,
      },
    });

    if (searchParam == "current") {
      const itemIDs = items
        .filter((item) => !item.returned)
        .map((item) => item.id);
      await returnSelectedItems(itemIDs);
    } else {
      const itemIDs = items.map((item) => item.id);
      await unreturnSelectedItems(itemIDs);
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteSelectedItems = async (itemIds: number[]) => {
  try {
    for (const id of itemIds) {
      await deleteItem(id);
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    return { error: "Failed to delete item" };
  }
};

export const deleteAllItems = async () => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  try {
    const items = await prisma.items.findMany({
      where: {
        OR: [
          {
            receipt: {
              project: {
                userId: userId,
              },
            },
          },
          {
            receipt: {
              project: {
                projectUsers: { some: { userId } },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        returned: true,
      },
    });
    const itemIDs = items.map((item) => item.id);

    for (const id of itemIDs) {
      await deleteItem(id);
    }
  } catch (err) {
    console.error(err);
  }
};
