"use client";
import styles from "@/app/receipt/receiptID.module.css";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item } from "@/types/receipt";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ImageModal from "@/app/components/images/ImageModal";
import { useState } from "react";

interface ReceiptItemsProps {
  item: Item;
  asset_amount: number;
  index: number;
  length: number;
}

export const ReceiptItems = ({ item, asset_amount }: ReceiptItemsProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${styles.box} shadow relative `}>
      {item.photo_url && (
        <div className="w-full h-[110px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col ">
          <Image
            src={item.photo_url}
            alt=""
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t-md cursor-pointer"
            onClick={() => setIsOpen(true)}
            style={{ objectPosition: "top" }}
          />
          <ImageModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            imageUrl={item.photo_url}
            altText="Your Image Description"
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 justify-between">
        <div>
          {!item.photo_url && <Shirt />}
          <div className="border-b-[1px] border-slate-400">
            <Link href={`/item/${item.id}`}>
              <TruncateText
                text={item.description}
                maxLength={30}
                styles={"text-orange-600"}
              />
            </Link>
            {asset_amount > item.price && (
              <p className="text-emerald-900">Asset</p>
            )}
          </div>

          <div className="text-xs mt-2 flex flex-col gap-1">
            <div className="">
              <p className="text-slate-400">Price</p>
              <p className="">{formatCurrency(item.price)}</p>
            </div>
            {item.barcode && (
              <div className="">
                <p className="text-slate-400">Barcode</p>
                <p className="">{item.barcode}</p>
              </div>
            )}
            {item.product_id && (
              <div className="">
                <p className="text-slate-400">Product ID</p>
                <p className="">{item.product_id}</p>
              </div>
            )}
          </div>
        </div>
        {pathname.endsWith("edit") && (
          <Link
            className="text-sm text-center border-t-[1px] pt-2 text-emerald-900"
            href={`/item/${item.id}/edit`}
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  );
};
