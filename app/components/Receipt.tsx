"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";

import Link from "next/link";
import React, { useState } from "react";

interface ReceiptProps {
  receipt: ReceiptType;
}

const Receipt = ({ receipt }: ReceiptProps) => {
  console.log(receipt);
  const [items, setItems] = useState(false);

  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-2">
      <div className="flex flex-col mb-2">
        <div>
          <h1 className="text-xl text-orange-600">
            <Link href="/receipt">{receipt.store}</Link>
          </h1>
        </div>
        <h1 className="text-sm">
          Created on {formatDateToMMDDYY(receipt.created_at)}
        </h1>
      </div>

      <div className="flex justify-between">
        <h1 className="text-slate-400">Order Date</h1>
        <h1>{formatDateToMMDDYY(receipt.purchase_date)}</h1>
      </div>
      <div className="flex justify-between">
        <h1 className="text-slate-400">Return Date</h1>
        <h1>{formatDateToMMDDYY(receipt.return_date)}</h1>
      </div>
      <div className="flex justify-between">
        <h1 className="text-slate-400">Amount</h1>
        <h1>{receipt.amount}</h1>
      </div>
      <div className="flex justify-between">
        <h1 className="text-slate-400">Card</h1>
        <h1>{receipt.card}</h1>
      </div>
      <div className="flex justify-between items-start">
        <button className="text-slate-400" onClick={() => setItems(!items)}>
          Items
        </button>
        <div className="flex flex-col items-end">
          <button className="text-slate-400" onClick={() => setItems(!items)}>
            Items
          </button>
          {items && (
            <div className="flex flex-col">
              {receipt.items.map((item, index) => (
                <p key={item.description}>{item.description}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 mt-3">
        <RegularButton styles={"w-full border-emerald-900 "}>
          <p className="text-sm text-emerald-900 ">Edit</p>
        </RegularButton>
      </div> */}
    </div>
  );
};

export default Receipt;
