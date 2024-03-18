import Calender from "@/app/components/calender/Calender";
import { getReceipts } from "@/app/lib/receiptsDB";
import { Receipt } from "@/types/receiptTypes";
import React from "react";

// const receipt = async () => {
//   const receipts = await getReceipts();
//   return receipts as Receipt[];
// };

export default async function CalenderPage() {
  // const receipts = await receipt();
  // return <Calender receipts={receipts} />;
  return <div>Calender</div>;
}
