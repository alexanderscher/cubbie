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

  const fetchReceipt = async () => {
    const res = await fetch(`/api/receipt/${id}`);
    const data = await res.json();
    setReceipt(data.receipt);
  };

  useEffect(() => {
    fetchReceipt();
  }, []);

  if (!receipt.items) return <div>Loading</div>;
  return (
    <div className="receipts ">
      <div className="flex flex-col gap-4 ">
        <div className="flex flex-col gap-1 receipt-bar border-t-[1.5px] border-black pt-3">
          <div className="flex justify-between w-full">
            <h1 className="text-orange-600 text-xl">{receipt.store}</h1>
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
          </div>

          <h1 className="mt-4">Details</h1>
          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Created on</h1>
            <h1 className="">{formatDateToMMDDYY(receipt.created_at)}</h1>
          </div>
          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Type</h1>
            {!receipt.memo &&
              (receipt.type == "Online" ? (
                <p className="text-sm ">{receipt.type}</p>
              ) : (
                <p className="text-sm ">In-{receipt.type}</p>
              ))}
          </div>

          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Number of Items</h1>
            <h1 className="">{receipt.items.length}</h1>
          </div>
          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Total Amount</h1>
            <h1 className="">{receipt.amount}</h1>
          </div>
          {receipt.card && (
            <div className="flex justify-between max-w-[500px]">
              <h1 className="text-slate-400  text-sm">Card</h1>
              {receipt.card}
            </div>
          )}

          {receipt.type === "Online" && receipt.tracking_number && (
            <div className="flex justify-between max-w-[500px]">
              <h1 className="text-slate-400  text-sm">Tracking Link</h1>
              <a className="" href={receipt.tracking_number} target="_blank">
                {receipt.tracking_number}
              </a>
            </div>
          )}

          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Purchase Date</h1>
            <h1 className=""> {formatDateToMMDDYY(receipt.purchase_date)}</h1>
          </div>
          <div className="flex justify-between max-w-[500px]">
            <h1 className="text-slate-400  text-sm">Return Date</h1>

            {receipt.purchase_date && receipt.days_until_return && (
              <h1 className="">{formatDateToMMDDYY(receipt.return_date)}</h1>
            )}
          </div>
        </div>
        <div className="w-full">
          {receipt.receipt_image_url && (
            <div
              className="w-full h-full overflow-hidden relative flex items-center justify-center rounded-sm "
              style={{ height: "300px" }}
            >
              <Image
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                src={receipt.receipt_image_url}
                alt=""
                className="absolute"
              />
            </div>
          )}
        </div>
      </div>

      <div className="w-full gap-10  mb-[100px]">
        {receipt.items.map((item: Item, index: number) => (
          <div key={index} className="pb-5">
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
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 w-full pt-3">
      <div className="w-full h-full flex gap-6">
        <div className="text-sm flex flex-col gap-3 items-start w-full max-w-[200px] ">
          <div className="w-full">
            <button type="button" className="text-orange-600 text-lg">
              {item.description}
            </button>
          </div>
          {item.asset && (
            <div className="w-full">
              <h1>{item.asset}</h1>
            </div>
          )}
          <div className="w-full">
            <h1 className="text-slate-400 ">AMOUNT</h1>

            <h1>{formatCurrency(item.price)}</h1>
          </div>
          {item.character && (
            <div className="w-full">
              <h1 className="text-slate-400 ">CHARACTER</h1>

              <h1>{item.character}</h1>
            </div>
          )}
          {item.product_id && (
            <div className="w-full">
              <h1 className="text-slate-400 ">PRODUCT ID</h1>

              <h1>{item.product_id}</h1>
            </div>
          )}
          {item.barcode && (
            <div className="w-full">
              <h1 className="text-slate-400 ">BARCODE</h1>

              <h1>{item.barcode}</h1>
            </div>
          )}
        </div>
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
      </div>
    </div>
  );
};
