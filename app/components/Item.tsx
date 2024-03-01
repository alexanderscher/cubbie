"use client";
import { markAsReturned, unreturn } from "@/app/actions/return";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
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
  const { setRefreshData } = useSearchItemContext();

  return (
    <div className="box justify-between">
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
          <button className="absolute top-0 right-0 m-2 text-[10px] border border-orange-600 py-1 px-3 rounded-full text-orange-600">
            <Link href={`/item/${item.id}/edit/`}>Edit</Link>
          </button>
        </div>
      )}
      {!item.photo_url && (
        <div className="relative">
          <Shirt />
          <button className="absolute top-0 right-0 m-2 text-[10px] border border-orange-600 py-1 px-3 rounded-full text-orange-600">
            <Link href={`/item/${item.id}/edit/`}>Edit</Link>
          </button>
        </div>
      )}
      <div className="p-3 flex flex-col  ">
        <Link href={`/item/${item.id}`} className="">
          <TruncateText
            text={item.description}
            maxLength={18}
            styles={"text-orange-600 text-sm"}
          />
        </Link>
        <div className="text-xs">
          <p className="text-slate-400  ">
            Return by {formatDateToMMDDYY(item.receipt.return_date)}
          </p>
        </div>

        <div>
          <div className="border-t-[1px] border-slate-300 flex flex-col  gap-1 text-xs">
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

            <div className="">
              <p className="text-slate-400  ">Price</p>
              <p className="">{formatCurrency(item.price)}</p>
            </div>
            {item.barcode && (
              <div className="">
                <p className="text-slate-400  ">Barcode</p>
                <p className="">{item.barcode}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={`${
          item.returned
            ? "border-t-orange-600 text-orange-600"
            : "border-t-emerald-900"
        } border-t-[1px] text-xs text-center  text-emerald-900 p-2`}
      >
        {item.returned ? (
          <button
            onClick={async () => {
              const { ok, data } = await unreturn(item.id);
              if (ok) {
                setRefreshData(true);
              } else {
                console.error("Failed to unreturn", data);
              }
            }}
          >
            <p className="text-orange-600">Returned</p>
          </button>
        ) : (
          <button
            onClick={async () => {
              const { ok, data } = await markAsReturned(item.id);
              if (ok) {
                setRefreshData(true);
              } else {
                console.error("Failed to mark as returned:", data);
              }
            }}
          >
            Mark as Returned
          </button>
        )}
      </div>
    </div>
  );
};

export default Item;
