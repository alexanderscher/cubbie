"use client";
import styles from "@/app/receipt/receiptID.module.css";
import RegularButton from "@/app/components/buttons/RegularButton";
import { Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ReceiptItems } from "@/app/components/receiptComponents/ReceiptItems";

const ReceiptPage = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState({} as ReceiptType);

  useEffect(() => {
    const fetchReceipt = async () => {
      const res = await fetch(`/api/receipt/${id}`);
      const data = await res.json();
      setReceipt(data.receipt);
    };
    fetchReceipt();
  }, [id]);
  console.log(receipt);

  if (!receipt.items) return <div>Loading</div>;
  return (
    <div className="flex flex-col gap-8  max-w-[1060px] h-full pb-[200px]">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl text-orange-600 w-3/4">{receipt.store}</h1>
        <RegularButton styles="bg-emerald-900">
          <Link href={`/receipt/${receipt.id}/edit`}>
            <p className="text-white text-sm">Edit</p>
          </Link>
        </RegularButton>
      </div>
      <div className="flex bg-white rounded-md text-sm shadow p-4">
        <div className="w-1/3 border-r-[1.5px] border-slate-300 ">
          <p className="text-slate-500 text-xs">Total amount</p>
          <p>{formatCurrency(receipt.amount)}</p>
        </div>
        <div className="w-1/3 border-r-[1.5px] border-slate-300 pl-4 pr-2">
          <p className="text-slate-500 text-xs">Purcahse Date</p>
          <p>{formatDateToMMDDYY(receipt.purchase_date)}</p>
        </div>

        <div className="pl-4 pr-2">
          <p className="text-slate-500 text-xs">Return Date</p>
          <p>{formatDateToMMDDYY(receipt.return_date)}</p>
        </div>
      </div>
      <div className={`${styles.receipt} h-[700px]`}>
        <div className={`${styles.receiptLeft}  flex flex-col gap-2`}>
          <div
            className={`shadow rounded-md  bg-white flex flex-col gap-4 p-6`}
          >
            <p className="text-lg text-emerald-900">Receipt Information</p>
            {!receipt.receipt_image_url && (
              <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                <div className="w-full h-full flex justify-center items-start ">
                  <Image
                    src="/receipt_b.png"
                    alt=""
                    width={60}
                    height={60}
                    className="object-cover bg-white pt-4"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
            )}

            {receipt.receipt_image_url && (
              <div className="w-full h-[400px] overflow-hidden relative flex justify-center items-center flex-shrink-0  rounded-md">
                <div className="w-[300px] flex justify-center">
                  <Image
                    src={receipt.receipt_image_url}
                    width={280}
                    height={280}
                    alt="Receipt Image"
                    className="object-contain rounded-md"
                    layout="intrinsic"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6 text-sm ">
              <div className="w-full  border-slate-400 border-b-[1.5px] pb-2 ">
                <p className="text-slate-500 text-xs">Quantity</p>
                <p className="">{receipt.items.length}</p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1.5px] pb-2 ">
                <p className="text-slate-500 text-xs">Updated at</p>
                <p className="">{formatDateToMMDDYY(receipt.created_at)}</p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1.5px] pb-2 ">
                <p className="text-slate-500 text-xs">Receipt Type</p>
                <p className="">{receipt.type}</p>
              </div>

              <div className="w-full  border-slate-400 border-b-[1.5px] pb-2 ">
                <p className="text-slate-500 text-xs">Card</p>
                <p className="">{receipt.card ? receipt.card : "None"}</p>
              </div>

              <div className="w-full  border-slate-400 border-b-[1.5px] pb-2 ">
                <p className="text-slate-500 text-xs">Tracking Link</p>
                <p className="">
                  {receipt.tracking_number ? receipt.tracking_number : "None"}
                </p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1.5px] pb-2 ">
                <p className="text-slate-500 text-xs">Asset Amount</p>
                <p className="">
                  {receipt.asset_amount
                    ? formatCurrency(receipt.asset_amount)
                    : "None"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:w-1/2 w-full pb-[200px]">
          <p className="text-lg text-emerald-900">Items</p>
          <div className={`${styles.boxes} `}>
            {receipt.items.length > 0 &&
              receipt.items.map((item: any) => (
                <ReceiptItems
                  key={item.id}
                  item={item}
                  asset_amount={receipt.asset_amount}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
