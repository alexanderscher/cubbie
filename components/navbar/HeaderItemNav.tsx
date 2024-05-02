import { TruncateText } from "@/components/text/Truncate";
import { ItemType } from "@/types/ItemsTypes";
import Link from "next/link";
import React from "react";

interface HeaderNavProps {
  item: ItemId;
}

const HeaderNav = ({ item }: HeaderNavProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 border-b-[1px] border-emerald-900 pb-4">
      <div className="flex gap-4">
        {item.receipt.project && (
          <div className="flex">
            <Link href={`/project/${item.receipt.project.id}`}>
              <p className="text-emerald-900 hover:text-orange-600 text-sm">
                {item.receipt.project.name}
              </p>
            </Link>
          </div>
        )}
        {item.receipt.project && <p className="text-emerald-900 text-sm">/</p>}

        <Link href={`/receipt/${item.receipt.id}`}>
          <p className="text-emerald-900 text-sm hover:text-orange-600">
            {item.receipt.store}
          </p>
        </Link>

        <p className="text-emerald-900 text-sm">/</p>
        <TruncateText
          text={item.description}
          styles={"text-emerald-900 text-sm"}
        />
      </div>
    </div>
  );
};

export default HeaderNav;
