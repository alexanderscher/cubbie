"use client";
import styles from "@/app/receipt/receiptID.module.css";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item } from "@/types/receipt";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";

interface ReceiptItemsProps {
  item: Item;
  asset_amount: number;
  index: number;
  length: number;
}

export const ReceiptItems = ({ item, asset_amount }: ReceiptItemsProps) => {
  // const pathname = usePathname();
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="box">
      {item.photo_url && (
        <div className="w-full h-[110px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col">
          <Image
            src={item.photo_url}
            alt=""
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t-lg"
            style={{ objectPosition: "top" }}
          />
        </div>
      )}
      {!item.photo_url && <Shirt />}
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
      <div className="border-t-[1px] text-sm text-center  text-emerald-900 p-2">
        <Link href={`/item/${item.id}/edit/`}>Edit</Link>
      </div>
    </div>
  );
};
