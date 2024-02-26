"use client";
import { useSearchContext } from "@/app/components/context/SearchContext";
import Receipt from "@/app/components/receiptComponents/Receipt";
import { Receipt as ReceiptType } from "@/types/receipt";
import { usePathname } from "next/navigation";

const Receipts = () => {
  const { filteredData } = useSearchContext();

  const pathname = usePathname();

  return (
    <div className="boxes">
      {filteredData.map((receipt: ReceiptType) => (
        <Receipt key={receipt.id} receipt={receipt} />
      ))}
    </div>
  );
};

export default Receipts;
