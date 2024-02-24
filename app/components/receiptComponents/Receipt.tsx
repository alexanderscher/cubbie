import { TruncateText } from "@/app/components/text/Truncate";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";

interface ReceiptProps {
  receipt: ReceiptType;
}

const Receipt = ({ receipt }: ReceiptProps) => {
  return (
    <div className="box sm:pb-6 pb-4 p-1">
      <div className="sm:p-4 p-2 flex flex-col gap-2">
        <p className="text-slate-500 text-xs text-end">
          {formatDateToMMDDYY(receipt.created_at)}
        </p>
        <div className="w-full  overflow-hidden relative flex justify-center items-center">
          <div className="w-full h-full flex justify-center items-center">
            <Image
              src="/receipt_b.png"
              alt=""
              width={38}
              height={38}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
        <Link href={`/receipt/${receipt.id}`}>
          <TruncateText
            text={receipt.store}
            maxLength={15}
            styles={"text-orange-600 text-xs sm:text-lg"}
          />
        </Link>

        <p className="text-slate-500 text-xs ">
          Return by {formatDateToMMDDYY(receipt.return_date)}
        </p>

        <div className="">
          <div className="border-t-[1px] border-slate-300  flex flex-col text-xs sm:text-sm">
            <div className="flex gap-1 mt-2">
              <p className=" ">{receipt.items.length} items | </p>
              <p className=" ">
                {formatCurrency(
                  receipt.items.reduce((acc: number, curr: Item) => {
                    return acc + curr.price;
                  }, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
