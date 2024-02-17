"use client";
import NonClickableButton from "@/app/components/buttons/NonClickableButton";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  if (!receipt.items) return <div>Loading</div>;
  return (
    <div className="flex justify-center items-center">
      <div className=" w-full rounded-sm p-4">
        <div className="  overflow-hidden relative flex justify-center items-center">
          <div className="w-full h-full flex justify-center items-center">
            <Image
              src="/receipt-placeholder.png"
              alt=""
              width={50}
              height={50}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
        <div className="text-2xl text-orange-600">{receipt.store}</div>
        <div className="flex flex-wrap gap-6 mt-5">
          <div className="flex gap-3   ">
            <p className="text-slate-500">Total Price:</p>
            <p>{receipt.amount}</p>
          </div>
          <div className="flex gap-3   ">
            <p className="text-slate-500">Total Quantities:</p>
            <p>{receipt.items.length}</p>
          </div>
          <div className="flex gap-3   ">
            <p className="text-slate-500">Purchase Date:</p>
            <p>{formatDateToMMDDYY(receipt.purchase_date)}</p>
          </div>
          <div className="flex gap-3   ">
            <p className="text-slate-500">Reutrn Date:</p>
            <p>{formatDateToMMDDYY(receipt.return_date)}</p>
          </div>
          {receipt.card && (
            <div className="flex gap-3   ">
              <p className="text-slate-500">Card:</p>
              <p>{receipt.card}</p>
            </div>
          )}
          {receipt.tracking_number && (
            <div className="flex gap-3   ">
              <p className="text-slate-500">Tracking Link:</p>
              <p>{receipt.tracking_number}</p>
            </div>
          )}

          <div className="flex gap-3   ">
            <p className="text-slate-500">Type:</p>
            <p>{receipt.type}</p>
          </div>
        </div>

        <div className="boxes mt-10">
          {receipt.items.length > 0 &&
            receipt.items.map((item: any) => (
              <ReceiptItems key={item.id} item={item} />
            ))}
        </div>
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
    <div className="box-item ">
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
            {/* <p className="text-slate-400 text-xs ">
              Return by {formatDateToMMDDYY(item.receipt.return_date)}
            </p> */}
          </div>

          {/* <div className="border-t-[1.5px] border-slate-300 flex flex-col  text-sm">
            <TruncateText
              text={item.receipt.store}
              maxLength={20}
              styles={""}
            />
            <p className="">{formatCurrency(item.price)}</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};
