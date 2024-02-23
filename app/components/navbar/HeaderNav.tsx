import RegularButton from "@/app/components/buttons/RegularButton";
import { Receipt } from "@/types/receipt";
import Link from "next/link";
import React from "react";

interface HeaderNavProps {
  receipt: Receipt;
}

const HeaderNav = ({ receipt }: HeaderNavProps) => {
  return (
    <div className="flex justify-between items-center gap-4 border-b-[1px] border-emerald-900 pb-4">
      <div className="flex gap-3">
        <Link href={receipt.memo ? "/memo" : "/"}>
          <p className="text-emerald-900 hover:text-orange-600 text-sm">
            {receipt.memo ? "Memos" : "Receipts"}
          </p>
        </Link>
        <p className="text-emerald-900 text-sm">/</p>
        <p className="text-emerald-900 text-sm">{receipt.store}</p>
      </div>

      <RegularButton
        href="/receipt-type"
        styles="bg border-emerald-900 text-emerald-900"
      >
        <p className="text-xs">Create new</p>
      </RegularButton>
    </div>
  );
};

export default HeaderNav;
