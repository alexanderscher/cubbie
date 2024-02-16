"use client";
import NonClickableButton from "@/app/components/buttons/NonClickableButton";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ReceiptPage = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState({} as ReceiptType);
  console.log(receipt);
  const fetchReceipt = async () => {
    const res = await fetch(`/api/receipt/${id}`);
    const data = await res.json();
    setReceipt(data.receipt);
  };
  console.log(receipt);
  useEffect(() => {
    fetchReceipt();
  }, []);

  if (!receipt.items) return <div>Loading</div>;
  return (
    <div className="receipts ">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 receipt-bar">
          <h1 className="text-orange-600 text-lg">{receipt.store}</h1>
          <div className="flex gap-2 items-start mt-2">
            {receipt.memo ? (
              <NonClickableButton small styles="bg border-black">
                <p className="text-xs text-black">Memo</p>
              </NonClickableButton>
            ) : (
              <NonClickableButton small styles="bg-black border-black">
                <p className="text-xs text-white">Receipt</p>
              </NonClickableButton>
            )}
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">CREATED ON</h1>
            <h1 className="">{formatDateToMMDDYY(receipt.created_at)}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">TYPE</h1>
            {!receipt.memo &&
              (receipt.type == "Online" ? (
                <p className="text-sm ">{receipt.type}</p>
              ) : (
                <p className="text-sm ">In-{receipt.type}</p>
              ))}
          </div>

          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">NUMBER OF ITEMS</h1>
            <h1 className="">{receipt.items.length}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">TOTAL AMOUNT</h1>
            <h1 className="">{receipt.amount}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">CARD</h1>
            {receipt.card ? receipt.card : "None"}
          </div>
          {receipt.type === "Online" && (
            <div className="receipt-info">
              <h1 className="text-slate-400  text-sm">TRACKING NUMBER</h1>
              <a className="" href={receipt.tracking_number} target="_blank">
                {receipt.tracking_number ? receipt.tracking_number : "None"}
              </a>
            </div>
          )}

          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">PURCHASE DATE</h1>
            <h1 className=""> {formatDateToMMDDYY(receipt.purchase_date)}</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400  text-sm">RETURN DATE</h1>

            {receipt.purchase_date && receipt.days_until_return && (
              <h1 className="">{formatDateToMMDDYY(receipt.return_date)}</h1>
            )}
          </div>
        </div>
        {receipt.receipt_image_url && (
          <div className="w-24 h-50 overflow-hidden relative flex items-center justify-center rounded-sm">
            <Image
              width={200}
              height={200}
              src={receipt.receipt_image_url}
              alt=""
            />
          </div>
        )}
      </div>

      <div className="w-full gap-10  mb-[100px]">
        {receipt.items.map((item: Item, index: number) => (
          <div key={index} className="pt-5">
            <ReceiptItems item={item} key={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiptPage;

interface ReceiptItemsProps {
  item: Item;
}

const ReceiptItems = ({ item }: ReceiptItemsProps) => {
  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 w-full pt-5">
      <div className="w-full h-full flex gap-6">
        {item.photo_url && (
          <div className="w-[120px] h-[150px] overflow-hidden relative flex items-center justify-center  flex-shrink-0 rounded-sm">
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
        <div className="text-sm flex flex-col gap-3 items-start w-full ">
          <div className="w-full">
            <button type="button" className="text-orange-600 text-lg">
              {item.description}
            </button>
          </div>

          <div className="w-full">
            <h1 className="text-slate-400 ">AMOUNT</h1>

            <h1>{formatCurrency(item.price)}</h1>
          </div>

          <div className="w-full">
            <h1 className="text-slate-400 ">CHARACTER</h1>

            <h1>{item.character}</h1>
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 ">PRODUCT ID</h1>

            <h1>{item.product_id}</h1>
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 ">BARCODE</h1>

            <h1>{item.barcode}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
