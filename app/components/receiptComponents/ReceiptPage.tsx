"use client";
import ReceiptFormItems from "@/app/components/createForm/ReceiptFormItems";
import { ItemInput } from "@/types/form";
import { Receipt as ReceiptType } from "@/types/receipt";
import { calculateReturnDate } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ReceiptPage = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState({} as ReceiptType);
  console.log(receipt);
  const fetchReceipt = async () => {
    const res = await fetch(`/api/receipt/${id}`);
    const data = await res.json();
    setReceipt(data.receipt);
  };
  console.log(receipt);
  useEffect(() => {
    fetchReceipt();
  }, []);

  if (!receipt.items) return <div>Loading</div>;
  return (
    <div className="receipts ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 receipt-bar">
          <h1 className="text-orange-600 text-lg">{receipt.store}</h1>

          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">NUMBER OF ITEMS</h1>
            <h1 className="">{receipt.items.length}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">TOTAL AMOUNT</h1>
            <h1 className="">{formatCurrency(receipt.amount)}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">CARD</h1>
            {receipt.card ? receipt.card : "None"}
          </div>
          {receipt.type === "Online" && (
            <div className="receipt-info">
              <h1 className="text-slate-400  text-sm">TRACKING NUMBER</h1>
              <h1 className="">
                {receipt.tracking_number ? receipt.tracking_number : "None"}
              </h1>
            </div>
          )}

          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">PURCHASE DATE</h1>
            <h1 className=""> {receipt.purchase_date}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">RETURN DATE</h1>

            {receipt.purchase_date && receipt.days_until_return && (
              <h1 className="">
                {calculateReturnDate(
                  receipt.purchase_date,
                  receipt.days_until_return
                )}
              </h1>
            )}
          </div>
        </div>
        {receipt.receiptImage && (
          <div className="w-24 h-50 overflow-hidden relative flex items-center justify-center rounded-sm">
            <Image width={200} height={200} src={receipt.receiptImage} alt="" />
          </div>
        )}
      </div>

      {/* <div className="w-full gap-10  mb-[100px]">
        {receipt.items.map((item: ItemInput, index: number) => (
          <div key={index} className="pt-5">
            <ReceiptFormItems
              stage="Final"
              item={item}
              values={receipt}
              index={index}
              setFieldValue={setFieldValue}
            />
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default ReceiptPage;
