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

  const archiveColor =
    pathname === "/archive"
      ? "bg-black border-black text-white"
      : "bg border-black text-black ";
  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="header">
        <h1 className="text-3xl text-emerald-900  ">{type}</h1>
        <div className="flex gap-2">
          <RegularButton href="/" styles={receiptColor}>
            <p className="text-xs">Receipts</p>
          </RegularButton>
          <RegularButton href="/memo" styles={memoColor}>
            <p className="text-xs">Memos</p>
          </RegularButton>
          <RegularButton styles={itemColor} href="/items">
            <p className="text-xs">Items</p>
          </RegularButton>
          <RegularButton styles={archiveColor} href="/archive">
            <p className="text-xs">Archive</p>
          </RegularButton>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-[250px]">
          <input
            className="searchBar  placeholder:text-sm "
            placeholder={`Search ${type}`}
          ></input>
        </div>
        <div className="text-slate-400">Updated at</div>
      </div>
    </div>
  );
};

export default Header;
