import { Item } from "@/types/receipt";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HeaderItemNavProps {
  item: Item;
}

const HeaderItemNav = ({ item }: HeaderItemNavProps) => {
  return (
    <div className="flex gap-4 text-sm text-slate-600 items-center">
      <Link
        className="hover:text-orange-600"
        href={item.receipt.memo ? "/memo" : "/"}
      >
        {item.receipt.memo ? "Memos" : "Receipts"}
      </Link>
      <div>
        <Image
          width={10}
          height={10}
          alt="greater than"
          src="/greaterthan.png"
        ></Image>
      </div>

      <Link
        className="hover:text-orange-600"
        href={`/receipt/${item.receipt_id}`}
      >
        {item.receipt.store}
      </Link>
      <p>{">"}</p>
      <p>{item.description}</p>
    </div>
  );
};

export default HeaderItemNav;
