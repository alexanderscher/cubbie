"use client";

import { ReceiptOptionsModal } from "@/components/options/ReceiptOptions";
import { TruncateText } from "@/components/text/Truncate";
import { Item, Receipt as ReceiptType } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";

interface ReceiptProps {
  receipt: ReceiptType;
  isOpen: boolean;
  onToggleOpen: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Receipt = ({ receipt, onToggleOpen, isOpen }: ReceiptProps) => {
  const total_amount = receipt.items.reduce((acc: number, curr: Item) => {
    return acc + curr.price;
  }, 0);
  return (
    <div className="box xs:pb-6 pb-4 relative ">
      <Link href={`/receipt/${receipt.id}`}>
        <div className="w-full  overflow-hidden relative flex justify-center items-center bg-slate-100 rounded-t-lg h-[90px]">
          <div className="w-full h-full flex justify-center items-center ">
            <Image
              src="/receipt_b.png"
              alt=""
              width={24}
              height={24}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            {receipt?.expired && (
              <div className="absolute top-0 left-0 w-full h-full bg-orange-400 opacity-30 rounded-t-lg"></div>
            )}
            {receipt?.expired && (
              <p className="absolute top-2 left-2 flex  text-orange-600 text-xs border-[1px] border-orange-600 rounded-full px-3 py-1">
                Expired
              </p>
            )}
            <Image
              src="/three-dots.png"
              className="absolute top-0 right-2 cursor-pointer "
              alt=""
              width={20}
              height={20}
              onClick={onToggleOpen}
            />
          </div>
        </div>
        {isOpen && <ReceiptOptionsModal receipt={receipt} />}

        <div className="p-3 flex flex-col justify-between">
          <div className="">
            <TruncateText
              text={receipt.store}
              maxLength={18}
              styles={"text-orange-600"}
            />

            <p className="text-xs text-slate-400">
              Return by {formatDateToMMDDYY(receipt.return_date)}
            </p>
          </div>

          <div className="flex flex-col  gap-1 text-xs">
            <div className="flex gap-1  mt-2">
              <p className=" ">
                {receipt.items.length}{" "}
                {receipt.items.length === 1 ? "item" : "items"} |
              </p>
              <p className=" ">{formatCurrency(total_amount)}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Receipt;
