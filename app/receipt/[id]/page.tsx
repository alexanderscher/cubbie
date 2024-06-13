import { SearchItemProvider } from "@/components/context/SearchItemContext";
import { SearchReceiptProvider } from "@/components/context/SearchReceiptContext";
import ReceiptId from "@/components/receiptComponents/ReceiptId";
import React from "react";

export default async function ReceiptIdPage({}) {
  return (
    <SearchReceiptProvider>
      <SearchItemProvider>
        <div className="w-full flex justify-center ">
          <ReceiptId />
        </div>
      </SearchItemProvider>
    </SearchReceiptProvider>
  );
}
