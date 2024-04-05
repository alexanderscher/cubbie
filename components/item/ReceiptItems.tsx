"use client";
import Shirt from "@/components/placeholderImages/Shirt";
import { TruncateText } from "@/components/text/Truncate";
import { Item } from "@/types/AppTypes";

import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";

interface ReceiptItemsProps {
  item: Item;
  index: number;
  length: number;
}

export const ReceiptItems = ({ item }: ReceiptItemsProps) => {
  // const pathname = usePathname();
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="box">
      {item.photo_url && (
        <div className="w-full h-[110px] overflow-hidden  flex justify-center flex-shrink-0 flex-col relative">
          <Image
            src={item.photo_url}
            alt=""
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t-lg"
            style={{ objectPosition: "top" }}
          />
          <button className="absolute top-0 right-0 m-2 text-[10px] border border-orange-600 py-1 px-3 rounded-full text-orange-600">
            <Link href={`/item/${item.id}/edit/`}>Edit</Link>
          </button>
        </div>
      )}
      {!item.photo_url && (
        <div className="relative">
          <Shirt />
          <button className="absolute top-0 right-0 m-2 text-[10px] border border-orange-600 py-1 px-3 rounded-full text-orange-600">
            <Link href={`/item/${item.id}/edit/`}>Edit</Link>
          </button>
        </div>
      )}
      <div className="p-3 flex flex-col gap-2 justify-between">
        <Link href={`/item/${item.id}`} className="">
          <TruncateText
            text={item.description}
            maxLength={18}
            styles={"text-orange-600 text-sm"}
          />
        </Link>

        <div>
          <div className=" border-slate-300 flex flex-col  gap-2 text-xs">
            <div className="">
              <p className="text-slate-400   ">Price</p>
              <p className="">{formatCurrency(item.price)}</p>
            </div>
            {item.barcode && (
              <div className="">
                <p className="text-slate-400   ">Barcode</p>
                <p className="">{item.barcode}</p>
              </div>
            )}
            {item.product_id && (
              <div className="">
                <p className="text-slate-400   ">Product ID</p>
                <p className="">{item.product_id}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t-[1px] text-xs text-center text-emerald-900 p-2">
        <p>Mark as Returned</p>
      </div>
    </div>
  );
};
