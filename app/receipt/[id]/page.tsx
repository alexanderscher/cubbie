"use client";
import NonClickableButton from "@/app/components/buttons/NonClickableButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import Shirt from "@/app/components/placeholderImages/Shirt";
import Receipt from "@/app/components/receiptComponents/Receipt";
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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl text-orange-600">{receipt.store}</h1>
        <RegularButton styles="bg-emerald-900">
          <p className="text-white text-sm">Edit</p>
        </RegularButton>
      </div>
      <div className="flex bg-white p-4 rounded-md text-sm">
        <div className="w-1/4">
          <p className="text-slate-500">Total amount</p>
          <p>{formatCurrency(receipt.amount)}</p>
        </div>
        <div className="w-1/4">
          <p className="text-slate-500">Quantity</p>
          <p>{receipt.items.length}</p>
        </div>
        <div className="w-1/4">
          <p className="text-slate-500">Purchase date</p>
          <p>{formatDateToMMDDYY(receipt.purchase_date)}</p>
        </div>
        <div className="">
          <p className="text-slate-500">Return Date</p>
          <p>{formatDateToMMDDYY(receipt.return_date)}</p>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 border-emerald-900 border-[1.5px] rounded-md ">
          <div className="flex flex-col gap-2">
            {!receipt.receipt_image_url && (
              <div className="w-full  overflow-hidden relative flex justify-center items-center">
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
            )}

            {receipt.receipt_image_url && (
              <div className="w-full h-[140px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col ">
                <Image
                  src={receipt.receipt_image_url}
                  alt=""
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-t-sm"
                  style={{ objectPosition: "top" }}
                />
              </div>
            )}

            <div className="p-4">
              <p>{receipt.id}</p>
              <p>{formatDateToMMDDYY(receipt.created_at)}</p>
              <p>{receipt.type}</p>
              {receipt.card && <p>{receipt.card}</p>}
              {receipt.tracking_number && <p>{receipt.tracking_number}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* <div className=" w-full  flex flex-col gap-6">
        <div className="text-2xl text-orange-600 border-b-[1.5px] border-slate-500">
          {receipt.store}
        </div>

        <div className="">
          {receipt.receipt_image_url && (
            <div className="sm:max-w-[300px] sm:w-1/2 w-full ">
              <div
                className="w-full h-full overflow-hidden relative flex items-center justify-center rounded-sm  "
                style={{ height: "300px" }}
              >
                <Image
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                  src={receipt.receipt_image_url}
                  alt=""
                  className="absolute "
                />
              </div>
            </div>
          )}

          <div className="sm:w-3/4 w-full flex flex-col gap-2 text-sm">
            <div className="">
              <p className="text-slate-500">Total amount</p>
              <p>{formatCurrency(receipt.amount)}</p>
            </div>
            <div className="">
              <p className="text-slate-500">Purchase date</p>
              <p>{formatDateToMMDDYY(receipt.purchase_date)}</p>
            </div>
            <div className="">
              <p className="text-slate-500">Return Date</p>
              <p>{formatDateToMMDDYY(receipt.return_date)}</p>
            </div>
            <div className="">
              <p className="text-slate-500">Card</p>

              <p>sdcsdc{receipt.card}</p>
            </div>
            <div className="">
              <p className="text-slate-500">Tracking Link</p>

              <p>sdcc{receipt.tracking_number}</p>
            </div>
          </div>
        </div>

        <div className="boxes border-t-[1.5px] border-slate-500 pt-10">
          {receipt.items.length > 0 &&
            receipt.items.map((item: any) => (
              <ReceiptItems key={item.id} item={item} />
            ))}
        </div>
      </div> */}
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

          <div className="text-sm">
            <p className="">{formatCurrency(item.price)}</p>
            {item.barcode && <p className="">{item.barcode}</p>}
            {item.product_id && <p className="">{item.product_id}</p>}
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
