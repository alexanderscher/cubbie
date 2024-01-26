"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
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
  return (
    <div className="flex flex-col gap-6 mb-8 mt-10">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl text-green-900 font-bold">
          Inventory
        </h1>
        <div className="flex gap-2">
          <RegularButton styles={receiptColor}>
            <Link href="/">
              <p className="text-xs sm:text-sm">Receipts</p>
            </Link>
          </RegularButton>
          <RegularButton styles={itemColor}>
            <Link href="/items">
              <p className="text-xs sm:text-sm">Items</p>
            </Link>
          </RegularButton>
          <RegularButton styles={"bg-black border-black text-white"}>
            <Link href="/create">
              <p className="text-xs sm:text-sm">Create New</p>
            </Link>
          </RegularButton>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          className="border-[1.5px] w-full bg border-black rounded-md p-1 placeholder:text-black focus:outline-none"
          placeholder="Search"
        ></input>
        <select className="border-[1.5px] w-[100px] bg border-black rounded-md p-1 placeholder:text-black focus:outline-none"></select>
      </div>
    </div>
  );
};

export default Header;
