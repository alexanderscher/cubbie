import ReceiptId from "@/app/components/receiptComponents/ReceiptId";
import PageWrapper from "@/app/components/wrapper/PageWrapper";
import { getReceiptById } from "@/app/lib/receiptsDB";
import { Receipt } from "@/types/receiptTypes";

import React from "react";

const fetchReceipt = async (id: string) => {
  const receipt = await getReceiptById(id);
  return receipt as Receipt;
};

export default async function ReceiptIdPage({
  params,
}: {
  params: { id: string };
}) {
  const receipt = await fetchReceipt(params.id);
  return <ReceiptId receipt={receipt} />;
}
