import ReceiptId from "@/components/receiptComponents/ReceiptId";
import React from "react";

export default async function ReceiptIdPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="w-full flex justify-center ">
      <ReceiptId receiptId={params.id} />
    </div>
  );
}
