"use client";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
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
    <div className="box ">
      {item.photo_url && (
        <div className="w-full h-[140px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col ">
          <Image
            src={item.photo_url}
            alt=""
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t-sm"
            style={{ objectPosition: "top" }}
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 justify-between">
        <div>
          {!item.photo_url && <Shirt />}
          <TruncateText
            text={item.description}
            maxLength={30}
            styles={"text-orange-600"}
          />

          <div className="">
            <p className="text-slate-400 text-xs ">
              Return by {formatDateToMMDDYY(item.receipt.return_date)}
            </p>
          </div>

          <div className="border-t-[1.5px] border-slate-300 flex flex-col  text-sm">
            <TruncateText
              text={item.receipt.store}
              maxLength={20}
              styles={""}
            />
            <p className="">{formatCurrency(item.price)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
