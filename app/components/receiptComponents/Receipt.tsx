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
      <a href={`receipt/${receipt.id}`}>
        <TruncateText
          text={receipt.store}
          maxLength={30}
          styles={"text-orange-600"}
        />
      </a>

      <p className="text-slate-400 text-xs">
        Posted on {formatDateToMMDDYY(receipt.created_at)}
      </p>
      {receipt.receipt_image_url && (
        <div className="w-full h-[200px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col mt-3">
          <div className="w-full h-full">
            <Image
              src={receipt.receipt_image_url}
              alt=""
              width={200}
              height={200}
              className="w-full h-full object-cover"
              style={{ objectPosition: "top" }}
            />
          </div>
        </div>
      )}
      {!receipt.receipt_image_url && (
        <div className="w-full h-[200px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col mt-3">
          <div className="w-full h-full ">
            <Image
              src={"/image-placeholder.svg"}
              alt=""
              width={200}
              height={200}
              className="w-full h-full object-fit"
              style={{ objectPosition: "top" }}
            />
          </div>
        </div>
      )}
      <div className="pt-4">
        <p className="text-slate-400 text-xs ">
          Return by {formatDateToMMDDYY(receipt.return_date)}
        </p>
      </div>
      <div className="">
        <div className="border-t-[1.5px] border-slate-300  flex flex-col text-sm">
          <div className="flex gap-2 mt-2">
            <p className=" ">{receipt.items.length} items | </p>
            <p className=" ">{formatCurrency(receipt.amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
