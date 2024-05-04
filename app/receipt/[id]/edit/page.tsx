import { auth } from "@/auth";
import ReceiptIdEdit from "@/components/receiptComponents/ReceiptIdEdit";
import { Session } from "@/types/Session";
import React from "react";

export default async function ReceiptIdPage({
  params,
}: {
  params: { id: string };
}) {
  const session = (await auth()) as Session;
  return (
    <div className="w-full flex justify-center ">
      <ReceiptIdEdit receiptId={params.id} timezone={session.user.timezone} />
    </div>
  );
}
