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
    <div className="flex justify-center items-center max-w-[800px]">
      <div className=" w-full p-4 flex flex-col gap-6">
        <div className="text-2xl text-orange-600 border-b-[1.5px] border-slate-400">
          {receipt.store}
        </div>

        <div className="receipt-page">
          {receipt.receipt_image_url && (
            <div className="sm:max-w-[300px] sm:w-1/2 w-full">
              <div
                className="w-full h-full overflow-hidden relative flex items-center justify-center rounded-sm "
                style={{ height: "300px" }}
              >
                <Image
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                  src={receipt.receipt_image_url}
                  alt=""
                  className="absolute"
                />
              </div>
            </div>
          )}
          {!receipt.receipt_image_url && (
            <div className="sm:max-w-[200px] sm:w-1/2 w-full">
              <div className="w-full overflow-hidden relative flex items-center justify-center rounded-sm sm:h-[200px] h-[100px]">
                <Image
                  // layout="fill"
                  objectFit="cover"
                  objectPosition="top"
                  width={80}
                  height={80}
                  src={"/receipt-placeholder.png"}
                  alt=""
                  className="absolute bg"
                />
              </div>
            </div>
          )}

          <div className="w-1/2 flex flex-col gap-2 text-sm">
            <div>
              <p className="text-slate-400">Total amount</p>
              <p>{formatCurrency(receipt.amount)}</p>
            </div>
            <div>
              <p className="text-slate-400">Purchase date</p>
              <p>{formatDateToMMDDYY(receipt.purchase_date)}</p>
            </div>
            <div>
              <p className="text-slate-400">Return Date</p>
              <p>{formatDateToMMDDYY(receipt.return_date)}</p>
            </div>
            <div>
              <p className="text-slate-400">Card</p>
              sdfvsd
              <p>{receipt.card}</p>
            </div>
            <div>
              <p className="text-slate-400">Tracking Link</p>
              efscsdc
              <p>{receipt.tracking_number}</p>
            </div>
          </div>
        </div>

        <div className="boxes border-t-[1.5px] border-slate-400 pt-10">
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
