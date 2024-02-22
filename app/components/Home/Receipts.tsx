"use client";
import { useSearchContext } from "@/app/components/context/SearchContext";
import Receipt from "@/app/components/receiptComponents/Receipt";
import { Receipt as ReceiptType } from "@/types/receipt";
import { usePathname } from "next/navigation";

const Receipts = () => {
  const { filteredData } = useSearchContext();

  console.log(filteredData);
  const pathname = usePathname();

  if (pathname !== "/") {
    return (
      <div className="boxes">
        {filteredData
          .filter((receipt: ReceiptType) => receipt.memo === true)
          .map((receipt: ReceiptType) => (
            <Receipt key={receipt.id} receipt={receipt} />
          ))}
      </div>
    );
  }
  return (
    <div className="boxes">
      {filteredData
        .filter((receipt: ReceiptType) => receipt.memo === false)
        .map((receipt: ReceiptType) => (
          <Receipt key={receipt.id} receipt={receipt} />
        ))}
    </div>
  );
};

export default Receipts;
