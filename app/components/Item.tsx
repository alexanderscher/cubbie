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
      <div className="flex justify-between ">
        <div className="flex justify-between w-full">
          <div>
            <p className="text-orange-600">{item.description}</p>
            <p className="text-sm">
              Created on {formatDateToMMDDYY(item.receipt.created_at)}
            </p>
          </div>

          <a
            href={`/receipt/${item.receipt_id}`}
            className="text-slate-400 text-sm"
          >
            View receipt
          </a>
        </div>
      </div>

      <div className="flex w-full  gap-6">
        {item.photo_url && (
          <div className="w-[100px] h-[130px] overflow-hidden relative flex items-center justify-center  flex-shrink-0 rounded-sm">
            <div className="w-full h-full flex-shrink-0">
              <Image
                width={200}
                height={200}
                src={item.photo_url}
                alt=""
                className="object-contain"
              />
            </div>
          </div>
        )}
        <div className="text-sm flex flex-col gap-1 w-full">
          <div className="flex justify-between gap-4">
            <h1 className="text-slate-400 ">Store</h1>
            <h1 className="text-end">{item.receipt.store}</h1>
          </div>
          {item.barcode && (
            <div className="flex justify-between gap-4">
              <h1 className="text-slate-400 ">Barcode</h1>
              <h1 className="text-end">{item.barcode}</h1>
            </div>
          )}
          {item.product_id && (
            <div className="flex justify-between gap-4">
              <h1 className="text-slate-400 ">Prodcut ID</h1>
              <h1 className="text-end">{item.product_id}</h1>
            </div>
          )}

          <div className="flex justify-between gap-4">
            <h1 className="text-slate-400 ">Order Date</h1>
            <h1 className="text-end">
              {formatDateToMMDDYY(item.receipt.purchase_date)}
            </h1>
          </div>
          <div className="flex justify-between gap-4">
            <h1 className="text-slate-400 ">Return Date</h1>
            <h1 className="text-end">
              {formatDateToMMDDYY(item.receipt.return_date)}
            </h1>
          </div>

          <div className="flex justify-between gap-4">
            <h1 className="text-slate-400 ">Amount</h1>
            <h1 className="text-end">{formatCurrency(item.price)}</h1>
          </div>
          {item.character && (
            <div className="flex justify-between gap-4">
              <h1 className="text-slate-400 ">Character</h1>
              <h1 className="text-end">{item.character}</h1>
            </div>
          )}
          {item.asset && (
            <div className="flex justify-between gap-4">
              <h1 className="text-slate-400 ">Asset</h1>
              <h1 className="text-end">Asset</h1>
            </div>
          )}
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 mt-2">
        <RegularButton
          href={`/receipt/${item.receipt_id}`}
          styles={"w-full border-emerald-900 "}
        >
          <p className="text-sm text-emerald-900 ">View Receipt</p>
        </RegularButton>
      </div> */}
    </div>
  );
};

export default Item;
