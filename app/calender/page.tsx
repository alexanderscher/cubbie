import Calender from "@/components/calender/Calender";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getReceipts } from "@/lib/receiptsDB";
import { Receipt } from "@/types/AppTypes";
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
