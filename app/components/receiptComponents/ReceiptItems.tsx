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
}

export const ReceiptItems = ({ item, asset_amount }: ReceiptItemsProps) => {
  return (
    <div className={`${styles.box} shadow`}>
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
            {asset_amount > item.price && (
              <p className="text-emerald-900">Asset</p>
            )}
            <p className="">{formatCurrency(item.price)}</p>
            {item.barcode && <p className="">{item.barcode}</p>}
            {item.product_id && <p className="">{item.product_id}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
