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
      ? "bg-emerald-900 border-emerald-900 text-white"
      : "bg border-emerald-900 text-emerald-900 ";

  const itemColor =
    pathname === "/items"
      ? "bg-emerald-900 border-emerald-900 text-white"
      : "bg border-emerald-900 text-emerald-900 ";

  const archiveColor =
    pathname === "/archive"
      ? "bg-emerald-900 border-emerald-900 text-white"
      : "bg border-emerald-900 text-emerald-900 ";
  return (
    <div className="flex flex-col gap-6 mb-10">
      <div className="header">
        <h1 className="text-2xl text-emerald-900  ">{type}</h1>
        <div className="flex gap-2">
          <RegularButton href="/" styles={receiptColor}>
            <p className="text-xs">Receipts</p>
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
        <div className="w-[300px]">
          <input
            className="searchBar placeholder:text-black placeholder:text-sm "
            placeholder="Search Receipts"
          ></input>
        </div>
        <div>filter</div>
      </div>
    </div>
  );
};

export default Header;
