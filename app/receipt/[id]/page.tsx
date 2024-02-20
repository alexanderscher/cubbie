"use client";
import styles from "./receiptID.module.css";
import RegularButton from "@/app/components/buttons/RegularButton";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
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
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl text-orange-600 w-3/4">{receipt.store}</h1>
        <RegularButton styles="bg-emerald-900">
          <p className="text-white text-sm">Edit</p>
        </RegularButton>
      </div>
      <div className="flex bg-white rounded-md text-sm border-emerald-900 border-[1.5px] p-4">
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
          <p className="text-lg text-emerald-900">Receipt Info</p>
          <div
            className={` border-emerald-900 border-[1.5px] rounded-md p-4 bg-white flex flex-col gap-4`}
          >
            {!receipt.receipt_image_url && (
              <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                <div className="w-full h-full flex justify-center items-start ">
                  <Image
                    src="/receipt_b.png"
                    alt=""
                    width={50}
                    height={50}
                    className="object-cover bg-white"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
            )}

            {receipt.receipt_image_url && (
              <div className="w-full h-[300px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col rounded-md">
                <Image
                  src={receipt.receipt_image_url}
                  alt=""
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-t-sm"
                  style={{ objectPosition: "top" }}
                />
              </div>
            )}

            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Quantity</p>
                <p>{receipt.items.length}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Updated at</p>
                <p>{formatDateToMMDDYY(receipt.created_at)}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Receipt Type</p>
                <p>{receipt.type}</p>
              </div>

              {receipt.card ? (
                <div>
                  <p className="text-slate-500 text-xs">Card used</p>
                  <p>{receipt.card}</p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-500 text-xs">Card used</p>
                  <p>None</p>
                </div>
              )}
              {receipt.tracking_number ? (
                <div>
                  <p className="text-slate-500 text-xs">Tracking Link</p>
                  <p>{receipt.tracking_number}</p>
                </div>
              ) : (
                <div>
                  {" "}
                  <p className="text-slate-500 text-xs">Tracking Link</p>
                  <p>None</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-lg text-emerald-900">Items</p>
          <div className={`${styles.boxes}`}>
            {receipt.items.length > 0 &&
              receipt.items.map((item: any) => (
                <ReceiptItems key={item.id} item={item} />
              ))}
          </div>
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
    <div className={`${styles.box}`}>
      {item.photo_url && (
        <div className="w-full h-[110px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col ">
          <Image
            src={item.photo_url}
            alt=""
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t-md"
            style={{ objectPosition: "top" }}
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 justify-between">
        <div>
          {!item.photo_url && <Shirt />}
          <Link href={`/item/${item.id}`}>
            <TruncateText
              text={item.description}
              maxLength={30}
              styles={"text-orange-600"}
            />
          </Link>

          <div className="text-sm">
            <p className="">{formatCurrency(item.price)}</p>
            {item.barcode && <p className="">{item.barcode}</p>}
            {item.product_id && <p className="">{item.product_id}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
