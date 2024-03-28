import ReceiptId from "@/components/receiptComponents/ReceiptId";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getReceiptById } from "@/lib/receiptsDB";
import { Receipt } from "@/types/AppTypes";

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
  return (
    <div className="w-full flex justify-center ">
      <ReceiptId receipt={receipt} />
    </div>
  );
}
