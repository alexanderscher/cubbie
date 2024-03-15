import ReceiptIdEdit from "@/app/components/receiptComponents/ReceiptIdEdit";
import { getReceiptById } from "@/app/lib/receiptsDB";
import { Receipt } from "@/types/fetchReceipts";
import { unstable_noStore } from "next/cache";
import React from "react";

type ExtendedReceiptType = Receipt & {
  edit_image: string;
};

const fetchReceipt = async (id: string) => {
  const receipt = await getReceiptById(id);

  const formattedReceipt = {
    ...receipt,
    edit_image: "",
    purchase_date: receipt?.purchase_date ? receipt.purchase_date : "",
    return_date: receipt?.return_date ? receipt.return_date : "",
    project: {
      ...receipt?.project,
      receipts: [],
    },
  };

  return formattedReceipt as ExtendedReceiptType;
};

export default async function ReceiptIdPage({
  params,
}: {
  params: { id: string };
}) {
  unstable_noStore();
  const receipt = await fetchReceipt(params.id);
  console.log(receipt);
  return (
    <div>
      <ReceiptIdEdit receipt={receipt} />
    </div>
  );
}
