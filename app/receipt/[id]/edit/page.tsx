import ReceiptIdEdit from "@/components/receiptComponents/ReceiptIdEdit";
import React from "react";

export default async function ReceiptIdPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="w-full flex justify-center ">
      <ReceiptIdEdit receiptId={params.id} />
    </div>
  );
}
