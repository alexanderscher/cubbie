import { auth } from "@/auth";
import ReceiptId from "@/components/receiptComponents/ReceiptId";
import prisma from "@/prisma/client";
import { Receipt } from "@/types/AppTypes";
import { Session } from "next-auth";
import { cookies } from "next/headers";
import React from "react";

const getReceiptById = async (id: string) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const receipt = await prisma.receipt.findUnique({
    where: {
      project: {
        userId: userId,
      },
      id: parseInt(id),
    },
    include: {
      items: true,
      project: true,
    },
  });
  return receipt;
};

const fetchReceipt = async (id: string) => {
  cookies();
  const receipt = await getReceiptById(id);
  return receipt as Receipt;
};

export default async function ReceiptIdPage({
  params,
}: {
  params: { id: string };
}) {
  const receipt = await fetchReceipt(params.id);
  return (
    <div className="w-full flex justify-center ">
      <ReceiptId receipt={receipt} />
    </div>
  );
}
