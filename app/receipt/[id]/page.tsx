import ReceiptId from "@/components/receiptComponents/ReceiptId";
import { getReceiptById } from "@/lib/receiptsDB";
import { Receipt } from "@/types/AppTypes";
import { cookies } from "next/headers";
import React from "react";

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
