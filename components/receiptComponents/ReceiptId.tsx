"use client";
import styles from "@/app/receipt/receiptID.module.css";
import RegularButton from "@/components/buttons/RegularButton";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import HeaderNav from "@/components/navbar/HeaderNav";
import ImageModal from "@/components/images/ImageModal";
import { AddItem } from "@/components/item/AddItem";

import Item from "@/components/Item";
import { Item as ItemType, Receipt } from "@/types/receiptTypes";

interface ReceiptIdProps {
  receipt: Receipt;
}

const ReceiptId = ({ receipt }: ReceiptIdProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openItemId, setOpenItemId] = useState(null as number | null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleOpenItem = (
    itemId: number | undefined,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (itemId === undefined) return;

    if (openItemId === itemId) {
      setOpenItemId(null);
    } else {
      setOpenItemId(itemId);
    }
  };
  const total_amount = receipt.items.reduce((acc: number, curr: ItemType) => {
    return acc + curr.price;
  }, 0);

  if (!receipt.items) return <div className="min-h-screen">Loading</div>;
  return (
    <div className="flex flex-col gap-8  w-full h-full ">
      <HeaderNav receipt={receipt} />
      <div className="flex justify-between items-center w-full flex-wrap gap-4">
        <h1 className="text-2xl text-orange-600 ">{receipt.store}</h1>
        <div className="flex gap-2  justify-end">
          <RegularButton
            styles="bg-emerald-900"
            handleClick={() => setIsAddOpen(true)}
          >
            <p className="text-white text-xs">Add item</p>
          </RegularButton>
          <RegularButton
            styles="bg-emerald-900"
            href={`/receipt/${receipt.id}/edit`}
          >
            <p className="text-white text-xs">Edit</p>
          </RegularButton>
        </div>
      </div>
      {isAddOpen && <AddItem setIsAddOpen={setIsAddOpen} id={receipt.id} />}
      <div className="flex bg-white  rounded text-sm shadow p-4 h-[80px] items-center">
        <div className="w-1/3 border-r-[1px] border-slate-300  ">
          <p className="text-slate-400 text-xs">Total amount</p>
          <p>{formatCurrency(total_amount)}</p>
        </div>
        <div className="w-1/3 border-r-[1px] border-slate-300 pl-2 pr-2">
          <p className="text-slate-400 text-xs">Purchase Date</p>
          <p>{formatDateToMMDDYY(receipt.purchase_date)}</p>
        </div>

        <div className="pl-2 pr-2">
          <p className="text-slate-400 text-xs">Return Date</p>
          <p>{formatDateToMMDDYY(receipt.return_date)}</p>
        </div>
      </div>
      <div className={`${styles.receipt} pb-[200px]`}>
        <div className={`${styles.receiptLeft} shadow  flex flex-col gap-2`}>
          <div
            className={`shadow rounded  bg-white flex flex-col gap-4 p-6   `}
          >
            {!receipt.receipt_image_url && (
              <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                <div className="w-full h-full flex justify-center items-start ">
                  <Image
                    src="/receipt_b.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover bg-white pt-4"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
            )}

            {receipt.receipt_image_url && (
              <div className="w-full flex justify-center items-center  ">
                <div className=" w-[200px] max-h-[200px]  rounded overflow-hidden">
                  <Image
                    src={receipt.receipt_image_url}
                    width={280}
                    height={280}
                    alt="Receipt Image"
                    className="object-contain rounded cursor-pointer"
                    layout="intrinsic"
                    onClick={() => setIsOpen(true)}
                  />
                </div>
              </div>
            )}
            <ImageModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              imageUrl={receipt.receipt_image_url}
              altText="Your Image Description"
            />

            <div className="flex flex-col gap-4 text-sm ">
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Receipt Type</p>
                <p className="">{receipt.memo ? "Memo" : "Receipt"}</p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Quantity</p>
                <p className="">{receipt.items.length}</p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Created at</p>
                <p className="">{formatDateToMMDDYY(receipt.created_at)}</p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Purchase Type</p>
                <p className="">{receipt.type}</p>
              </div>

              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Card</p>
                <p className="">{receipt.card ? receipt.card : "None"}</p>
              </div>

              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Tracking Link</p>
                <p className="">
                  {receipt.tracking_number ? receipt.tracking_number : "None"}
                </p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Asset Amount</p>
                <p className="">
                  {receipt.asset_amount
                    ? formatCurrency(receipt.asset_amount)
                    : "None"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col gap-2 pb-[200px] ${styles.boxContainer}`}
        >
          <div className={`${styles.boxes} `}>
            {isClient &&
              receipt.items.length > 0 &&
              receipt.items.map((item: ItemType, index: number) => (
                <Item
                  key={item.id}
                  item={item}
                  isOpen={openItemId === item.id}
                  onToggleOpen={(e) => toggleOpenItem(item.id, e)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptId;
