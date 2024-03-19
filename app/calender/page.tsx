import Calender from "@/app/components/calender/Calender";
import PageWrapper from "@/app/components/wrapper/PageWrapper";
import { getReceipts } from "@/app/lib/receiptsDB";
import { Receipt } from "@/types/receiptTypes";
import React from "react";

const receipt = async () => {
  const receipts = await getReceipts();
  return receipts as Receipt[];
};

export default async function CalenderPage() {
  const receipts = await receipt();
  return (
    <PageWrapper>
      <Calender receipts={receipts} />
    </PageWrapper>
  );
}
