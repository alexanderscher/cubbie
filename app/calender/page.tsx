import Calender from "@/app/components/calender/Calender";
import { getReceipts } from "@/app/lib/db";
import { Receipt } from "@/types/receipt";
import React from "react";

const fetchReceipts = async () => {
  const receipts = await getReceipts();
  return receipts as unknown as Receipt[];
};

export default async function CalenderPage() {
  const receipts = await fetchReceipts();
  return <Calender receipts={receipts} />;
}
