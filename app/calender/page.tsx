import Calender from "@/app/components/calender/Calender";
import { getReceipts } from "@/app/lib/receiptsDB";
import { Receipt } from "@/types/fetchReceipts";
import React from "react";

const fetchReceipts = async () => {
  const receipts = await getReceipts();
  return receipts as Receipt[];
};

export default async function CalenderPage() {
  const receipts = await fetchReceipts();
  return <Calender receipts={receipts} />;
}
