"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
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
    <div className="box  ">
      <TruncateText
        text={item.description}
        maxLength={30}
        styles={"text-orange-600"}
      />
      <p className="text-slate-400 text-xs">
        Posted on {formatDateToMMDDYY(item.receipt.created_at)}
      </p>

      {item.photo_url && (
        <div className="w-full h-[200px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col mt-3">
          <div className="w-full h-full">
            <Image
              src={item.photo_url}
              alt=""
              width={200}
              height={200}
              className="w-full h-full object-cover"
              style={{ objectPosition: "top" }}
            />
          </div>
        </div>
      )}
      {!item.photo_url && (
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
          Purchased on {formatDateToMMDDYY(item.receipt.purchase_date)}
        </p>
        <p className="text-slate-400 text-xs ">
          Return by {formatDateToMMDDYY(item.receipt.return_date)}
        </p>
      </div>

      <div className="border-t-[1.5px] border-slate-300 flex flex-col gap-2 text-sm">
        <TruncateText text={item.receipt.store} maxLength={30} styles={""} />
        <p className="">{formatCurrency(item.price)}</p>
      </div>
    </div>
  );
};

export default Item;
