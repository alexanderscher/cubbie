"use client";
import Receipt from "@/app/components/receiptComponents/Receipt";
import { Receipt as ReceiptType } from "@/types/receipt";
import React, { useEffect, useState } from "react";

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const fetchReceipts = async () => {
    const res = await fetch("/api/receipt");
    const data = await res.json();
    setReceipts(data.receipts);
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  return (
    <div className="grid grid-home grid-cols-3 gap-6 ">
      {receipts.map((receipt: ReceiptType) => (
        <Receipt key={receipt.id} receipt={receipt} />
      ))}
    </div>
  );
};

export default Receipts;
