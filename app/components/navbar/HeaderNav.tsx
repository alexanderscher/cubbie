import { Receipt } from "@/types/receipt";
import Link from "next/link";
import React from "react";

interface HeaderNavProps {
  receipt: Receipt;
}

const HeaderNav = ({ receipt }: HeaderNavProps) => {
  return (
    <div className="flex gap-4">
      <Link href={receipt.memo ? "/memo" : "/"}>
        {receipt.memo ? "Memos" : "Receipts"}
      </Link>
      <p>{receipt.store}</p>
    </div>
  );
};

export default HeaderNav;
