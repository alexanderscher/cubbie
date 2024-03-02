"use client";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ReceiptProps {
  receipt: ReceiptType;
}

const Receipt = ({ receipt }: ReceiptProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="box xs:pb-6 pb-4 relative">
      <div className="w-full  overflow-hidden relative flex justify-center items-center bg-slate-100 rounded-t-lg h-[90px]">
        <div className="w-full h-full flex justify-center items-center ">
          <Image
            src="/receipt_b.png"
            alt=""
            width={30}
            height={30}
            className="object-cover "
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <Image
            src="/three-dots.png"
            className="absolute top-0 right-2 cursor-pointer "
            alt=""
            width={20}
            height={20}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>
      {isOpen && <OptionsModal isOpen={isOpen} receipt={receipt} />}

      <div className="p-3 flex flex-col justify-between">
        {receipt.project && (
          <p className="text-xs text-emerald-900 mb-1">
            {receipt.project.name}
          </p>
        )}

        <div className="border-b-[1px] border-slate-400 ">
          <Link href={`/receipt/${receipt.id}`} className="">
            <TruncateText
              text={receipt.store}
              maxLength={18}
              styles={"text-orange-600"}
            />
          </Link>
          <p className="text-xs text-slate-400">
            Return by {formatDateToMMDDYY(receipt.return_date)}
          </p>
        </div>

        <div className="flex flex-col  gap-1 text-xs">
          <div className=" flex flex-col  gap-1 text-xs">
            <div className="flex gap-1 text-xs mt-2 ">
              <p className="">
                {receipt.type === "Store" ? "In Store" : "Online"}{" "}
                {receipt.memo ? "Memo" : "Receipt"}
              </p>
            </div>
          </div>
          <div className="flex gap-1  ">
            <p className=" ">
              {receipt.items.length}{" "}
              {receipt.items.length === 1 ? "item" : "items"} |
            </p>
            <p className=" ">
              {formatCurrency(
                receipt.items.reduce((acc: number, curr: Item) => {
                  return acc + curr.price;
                }, 0)
              )}
            </p>
          </div>
          {receipt.expired && <p className="text-orange-600">Expired</p>}
        </div>
      </div>
    </div>
  );
};

export default Receipt;

interface OptionsModalProps {
  isOpen: boolean;

  receipt: ReceiptType;
}

const OptionsModal = ({ isOpen, receipt }: OptionsModalProps) => {
  return (
    <div className="absolute bg-white right-0 top-6 rounded-md border-emerald-900 border-[1px]">
      <div className="p-4 rounded-lg text-sm">
        <Link href={`receipt/${receipt.id}/edit`}>
          <p>Edit</p>
        </Link>

        <p>Delete</p>
        <select>
          <option>Move to</option>
        </select>
      </div>
    </div>
  );
};
