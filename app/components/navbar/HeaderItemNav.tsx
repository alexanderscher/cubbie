import RegularButton from "@/app/components/buttons/RegularButton";
import { Item, Receipt } from "@/types/receipt";
import Link from "next/link";
import React from "react";

interface HeaderNavProps {
  item: Item;
}

const HeaderNav = ({ item }: HeaderNavProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 border-b-[1px] border-emerald-900 pb-4">
      <div className="flex gap-4">
        <Link href="/">
          <p className="text-emerald-900 hover:text-orange-600 text-sm">Home</p>
        </Link>
        <p className="text-emerald-900 text-sm">/</p>
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
        <p className="text-emerald-900 text-sm">{item.description}</p>
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
