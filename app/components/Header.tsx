"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { usePathname } from "next/navigation";
import React from "react";

interface HeaderProps {
  type: string;
}

const Header = ({ type }: HeaderProps) => {
  const pathname = usePathname();
  const receiptColor =
    pathname === "/"
      ? "bg-black border-black text-white"
      : "bg border-black text-black ";

  const memoColor =
    pathname === "/memo"
      ? "bg-black border-black text-white"
      : "bg border-black text-black ";

  const itemColor =
    pathname === "/items"
      ? "bg-black border-black text-white"
      : "bg border-black text-black ";

  return (
    <div className="flex flex-col gap-6 mb-4">
      <div className="flex justify-between">
        <h1 className="text-3xl text-emerald-900  ">{type}</h1>
        <RegularButton href="/receipt-type" styles="bg-emerald-900 text-white">
          <p className="text-sm">Create new</p>
        </RegularButton>
      </div>
      <div className="flex gap-2 flex-wrap">
        <RegularButton href="/" styles={receiptColor}>
          <p className="text-xs">Receipts</p>
        </RegularButton>
        <RegularButton href="/memo" styles={memoColor}>
          <p className="text-xs">Memos</p>
        </RegularButton>
        <RegularButton styles={itemColor} href="/items">
          <p className="text-xs">Items</p>
        </RegularButton>
      </div>
      <div className="flex justify-between">
        <div className="w-[290px]">
          <input
            className="searchBar  placeholder:text-sm placeholder:text-black "
            placeholder={`Search ${type}`}
          ></input>
        </div>
        {/* <div className="text-slate-500">Created at</div> */}
      </div>
    </div>
  );
};

export default Header;
