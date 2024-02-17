"use client";
import Receipt from "@/app/components/receiptComponents/Receipt";
import { Receipt as ReceiptType } from "@/types/receipt";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchReceipts = async () => {
      const res = await fetch("/api/receipt");
      const data = await res.json();
      setReceipts(data.receipts);
    };
    fetchReceipts();
  }, []);

  if (pathname !== "/") {
    return (
      <div className="boxes">
        {receipts
          .filter((receipt: ReceiptType) => receipt.memo === true)
          .map((receipt: ReceiptType) => (
            <Receipt key={receipt.id} receipt={receipt} />
          ))}
      </div>
    );
  }
  return (
    <div className="boxes">
      {receipts
        .filter((receipt: ReceiptType) => receipt.memo === false)
        .map((receipt: ReceiptType) => (
          <Receipt key={receipt.id} receipt={receipt} />
        ))}
    </div>
  );
};

export default Receipts;
