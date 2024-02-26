"use client";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item as ItemType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  item: ItemType;
}

const Item = ({ item }: Props) => {
  return (
    <div className="box">
      {item.photo_url && (
        <div className="w-full h-[110px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col">
          <Image
            src={item.photo_url}
            alt=""
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t-lg"
            style={{ objectPosition: "top" }}
          />
        </div>
      )}
      {!item.photo_url && <Shirt />}
      <div className="p-3 flex flex-col gap-2 justify-between">
        <Link href={`/item/${item.id}`} className="">
          <TruncateText
            text={item.description}
            maxLength={18}
            styles={"text-orange-600 text-sm"}
          />
        </Link>

        <div>
          <div className="border-t-[1px] border-slate-300 flex flex-col  gap-1 text-sm">
            <div className="mt-2">
              <p className="text-slate-400  ">Store</p>
              <Link href={`/receipt/${item.receipt_id}`} className="">
                <TruncateText
                  text={item.receipt.store}
                  maxLength={15}
                  styles={""}
                />
              </Link>
            </div>
            <div className="mb-2">
              <p className="text-slate-400  ">Price</p>
              <p className="">{formatCurrency(item.price)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-[1px] text-sm text-center  text-emerald-900 p-2">
        <Link href={`/item/${item.id}/edit/`}>Edit</Link>
      </div>
    </div>
  );
};

export default Item;
