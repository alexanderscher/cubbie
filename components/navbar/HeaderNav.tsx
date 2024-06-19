import { TruncateText } from "@/components/text/Truncate";
import { ReceiptType } from "@/types/ReceiptTypes";

import Link from "next/link";
import React from "react";

interface HeaderNavProps {
  receipt: ReceiptType;
}

const HeaderNav = ({ receipt }: HeaderNavProps) => {
  return (
    <div className="flex justify-between items-center gap-4 border-b-[1px] border-emerald-900 pb-4">
      <div className="flex gap-4">
        {receipt.project && (
          <Link href={`/project/${receipt.project.id}`}>
            <p className="text-emerald-900 hover:text-orange-600 text-sm">
              {receipt.project.name}
            </p>
          </Link>
        )}
        {receipt.project && <p className="text-emerald-900 text-sm">/</p>}

        <TruncateText
          text={receipt.store}
          styles={"text-emerald-900 text-sm"}
        />
      </div>
    </div>
  );
};

export default HeaderNav;
