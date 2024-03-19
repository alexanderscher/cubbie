import ReceiptIdEdit from "@/app/components/receiptComponents/ReceiptIdEdit";
import PageWrapper from "@/app/components/wrapper/PageWrapper";
import { getReceiptById } from "@/app/lib/receiptsDB";
import { Receipt } from "@/types/receiptTypes";
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
    },
  };

  return formattedReceipt as ExtendedReceiptType;
};

export default async function ReceiptIdPage({
  params,
}: {
  params: { id: string };
}) {
  const receipt = await fetchReceipt(params.id);
  return <ReceiptIdEdit receipt={receipt} />;
}
