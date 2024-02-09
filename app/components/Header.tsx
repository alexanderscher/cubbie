"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { usePathname } from "next/navigation";
import React from "react";

const Header = () => {
  const pathname = usePathname();
  const receiptColor =
    pathname === "/"
      ? "bg-green-900 border-green-900 text-white"
      : "bg border-green-900 text-green-900";

  const itemColor =
    pathname === "/items"
      ? "bg-green-900 border-green-900 text-white"
      : "bg border-green-900 text-green-900";

  const archiveColor =
    pathname === "/archive"
      ? "bg-green-900 border-green-900 text-white"
      : "bg border-green-900 text-green-900";
  return (
    <div className="flex flex-col gap-6  ">
      <div className="header">
        <h1 className="text-3xl text-green-900 ">Inventory</h1>
        <div className="flex gap-2">
          <RegularButton href="/" styles={receiptColor}>
            <p className="text-sm sm:text-sm">Receipts</p>
          </RegularButton>
          <RegularButton styles={itemColor} href="/items">
            <p className="text-sm sm:text-sm">Items</p>
          </RegularButton>
          <RegularButton styles={archiveColor} href="/archive">
            <p className="text-sm sm:text-sm">Archive</p>
          </RegularButton>
          <select className="border-[1.5px] w-[100px] bg border-black rounded-md p-1 placeholder:text-black focus:outline-none"></select>
        </div>
      </div>
      <div className="flex gap-2">
        <input className="searchBar" placeholder="Search"></input>
      </div>
    </div>
  );
};

export default Header;
