"use client";

import { TruncateText } from "@/app/components/text/Truncate";
import { Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";

import Link from "next/link";
import React, { useState } from "react";

interface ReceiptProps {
  receipt: ReceiptType;
}

const Receipt = ({ receipt }: ReceiptProps) => {
  console.log(receipt);

  return (
    <div className="box">
      <div className="p-4 flex flex-col gap-2">
        <p className="text-slate-400 text-xs text-end">
          {formatDateToMMDDYY(receipt.created_at)}
        </p>
        <div className="w-full  overflow-hidden relative flex justify-center items-center">
          <div className="w-full h-full flex justify-center items-center">
            <Image
              src="/receipt-placeholder.png"
              alt=""
              width={50}
              height={50}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
        <a href={`receipt/${receipt.id}`}>
          <TruncateText
            text={receipt.store}
            maxLength={20}
            styles={"text-orange-600"}
          />
        </a>

        <p className="text-slate-400 text-xs ">
          Return by {formatDateToMMDDYY(receipt.return_date)}
        </p>

        <div className="">
          <div className="border-t-[1.5px] border-slate-300  flex flex-col text-sm">
            <div className="flex gap-1 mt-2">
              <p className=" ">{receipt.items.length} items | </p>
              <p className=" ">{formatCurrency(receipt.amount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
