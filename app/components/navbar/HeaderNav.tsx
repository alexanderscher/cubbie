import RegularButton from "@/app/components/buttons/RegularButton";
import { Receipt } from "@/types/receiptTypes";

import Link from "next/link";
import React from "react";

interface HeaderNavProps {
  receipt: Receipt;
}

const HeaderNav = ({ receipt }: HeaderNavProps) => {
  return (
    <div className="flex justify-between items-center gap-4 border-b-[1px] border-emerald-900 pb-4">
      <div className="flex gap-4">
        {/* <Link href="/">
          <p className="text-emerald-900 hover:text-orange-600 text-sm">Home</p>
        </Link>
        <p className="text-emerald-900 text-sm">/</p> */}
        {receipt.project && (
          <Link href={`/project/${receipt.project.id}`}>
            <p className="text-emerald-900 hover:text-orange-600 text-sm">
              {receipt.project.name}
            </p>
          </Link>
        )}
        {receipt.project && <p className="text-emerald-900 text-sm">/</p>}

        <p className="text-emerald-900 text-sm">{receipt.store}</p>
      </div>

      {/* <RegularButton
        href="/create"
        styles="bg border-emerald-900 text-emerald-900"
      >
        <p className="text-xs">Create new</p>
      </RegularButton> */}
    </div>
  );
};

export default HeaderNav;
