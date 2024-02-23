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
    // <div className={` ${index === length - 1 ? "lastItemMargin" : ""} `}>
    <div className="box">
      {item.photo_url && (
        <div className="w-full h-[120px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col">
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
      <div className="p-4 flex flex-col gap-2 justify-between">
        <div>
          <Link href={`/item/${item.id}`} className="sm:text-lg text-sm">
            {!item.photo_url && <Shirt />}
            <TruncateText
              text={item.description}
              maxLength={18}
              styles={"text-orange-600"}
            />
          </Link>

          <p className="text-slate-500 text-xs ">
            Return by {formatDateToMMDDYY(item.receipt.return_date)}
          </p>

          <div className="border-t-[1px] border-slate-300 flex flex-col  text-sm">
            <TruncateText
              text={item.receipt.store}
              maxLength={15}
              styles={""}
            />

            <p className="">{formatCurrency(item.price)}</p>
          </div>
          {/* <div className="">
            {item.barcode && <p className="text-sm 00">{item.barcode}</p>}
            {item.product_id && <p className="text-sm 00">{item.product_id}</p>}
          </div> */}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Item;
