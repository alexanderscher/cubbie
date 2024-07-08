"use client";

import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import { ReceiptOptionsModal } from "@/components/options/ReceiptOptions";
import { Overlay } from "@/components/overlays/Overlay";
import { TruncateText } from "@/components/text/Truncate";
import TailwindCheckbox from "@/components/ui/TailwindCheckbox";
import { ReceiptItemType, ReceiptType } from "@/types/ReceiptTypes";
import { CheckedReceipts } from "@/types/SelectType";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";

interface ReceiptProps {
  receipt: ReceiptType;
  isOpen: boolean;
  onToggleOpen: (event: React.MouseEvent<HTMLDivElement>) => void;
  setOpenReceiptId: (id: number | null) => void;
  setCheckedReceipts: React.Dispatch<React.SetStateAction<CheckedReceipts[]>>;
  checkedReceipts: CheckedReceipts[];
}

const Receipt = ({
  receipt,
  onToggleOpen,
  isOpen,
  setOpenReceiptId,
  setCheckedReceipts,
  checkedReceipts,
}: ReceiptProps) => {
  const total_amount = receipt.items.reduce(
    (acc: number, curr: ReceiptItemType) => {
      return acc + curr.price;
    },
    0
  );

  const { selectReceiptTrigger } = useSearchReceiptContext();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const receiptId = receipt.id;

    setCheckedReceipts((prev: CheckedReceipts[]) =>
      event.target.checked
        ? [...prev, { receipt_id: receiptId, checked: true }]
        : prev.filter((entry) => entry.receipt_id !== receiptId)
    );
  };

  return (
    <div className="box xs:pb-6 pb-4 relative ">
      <div className="w-full  overflow-hidden relative flex justify-center items-center bg-slate-100 rounded-t-lg h-[90px]">
        <div className="w-full h-full flex justify-center items-center ">
          <Image
            src="/green/receipt_green.png"
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
          {selectReceiptTrigger && (
            <div
              className="absolute top-2 left-1 cursor-pointer flex gap-2 "
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
              }}
            >
              <TailwindCheckbox
                checked={
                  checkedReceipts &&
                  checkedReceipts.some(
                    (entry: CheckedReceipts) => entry.receipt_id === receipt.id
                  )
                }
                onChange={(e) => handleCheckboxChange(e)}
              />
            </div>
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
      <Link href={`/receipt/${receipt.id}`}>
        <div className="p-3 flex flex-col justify-between">
          <div className="">
            <TruncateText
              text={receipt.store}
              styles={"text-orange-600 text-sm"}
              type="not"
              // maxLength={20}
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
      {isOpen && (
        <>
          <Overlay onClose={() => setOpenReceiptId(null)} />
          <ReceiptOptionsModal receipt={receipt} />
        </>
      )}
    </div>
  );
};

export default Receipt;
