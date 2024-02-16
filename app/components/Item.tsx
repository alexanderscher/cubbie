"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { Item as ItemType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import React from "react";

interface Props {
  item: ItemType;
}

const Item = ({ item }: Props) => {
  console.log(item);
  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 ">
      <div className="flex justify-between">
        <div>
          <h1 className="text-orange-600">{item.description}</h1>
        </div>

        <h1 className="text-sm">
          Created on {formatDateToMMDDYY(item.receipt.created_at)}
        </h1>
      </div>
      <div className="flex gap-6 items-start">
        {item.photo_url && (
          <div className=" ">
            <Image
              src={item.photo_url}
              alt="jeans"
              width={160}
              height={160}
              style={{
                padding: "",
                objectFit: "contain",
                width: "100%",
                height: "100%",
                borderRadius: "2px",
              }}
            />
          </div>
        )}

        <div className="text-sm flex flex-col gap-1 ">
          <div>
            <h1 className="text-slate-400 ">Order Date</h1>
            <h1>{formatDateToMMDDYY(item.receipt.purchase_date)}</h1>
          </div>
          <div>
            <h1 className="text-slate-400 ">Return Date</h1>
            <h1>{formatDateToMMDDYY(item.receipt.return_date)}</h1>
          </div>

          <div>
            <h1 className="text-slate-400 ">Amount</h1>
            <h1>{formatCurrency(item.price)}</h1>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 mt-2">
        <RegularButton styles={"w-full border-emerald-900 "}>
          <p className="text-sm text-emerald-900 ">Edit</p>
        </RegularButton>

        <RegularButton styles={"w-full border-emerald-900 "}>
          <p className="text-sm text-emerald-900 ">View Receipt</p>
        </RegularButton>
      </div> */}
    </div>
  );
};

export default Item;
