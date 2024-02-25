"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { useSearchContext } from "@/app/components/context/SearchContext";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
import SearchBar from "@/app/components/search/SearchBar";
import { usePathname } from "next/navigation";
import React, { use, useEffect } from "react";

interface HeaderProps {
  type: string;
}

const Header = ({ type }: HeaderProps) => {
  const [data, setData] = React.useState([]);
  const { setFilteredData } = useSearchContext();
  const { setFilteredItemData } = useSearchItemContext();

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/items") {
      const fetchItems = async () => {
        const res = await fetch("/api/items");
        const data = await res.json();
        setData(data.items);
        setFilteredItemData(data.items);
      };
      fetchItems();
    }
  }, [pathname, setFilteredItemData]);

  useEffect(() => {
    if (pathname !== "/items") {
      const fetchReceipts = async () => {
        const res = await fetch("/api/receipt");
        const data = await res.json();
        setData(data.receipts);
        setFilteredData(data.receipts);
      };
      fetchReceipts();
    }
  }, [pathname, setFilteredData]);

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
    <div className="flex flex-col gap-6 pb-4 ">
      <div className="flex justify-between pb-2">
        <h1 className="text-3xl text-emerald-900  ">{type}</h1>
        <RegularButton
          href="/receipt-type"
          styles="bg-emerald-900 border-emerald-900 text-white"
        >
          <p className="text-xs">Create new</p>
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
      <SearchBar
        data={data}
        searchType={type}
        type={pathname === "/items" ? "item" : "receipt"}
      />
    </div>
  );
};

export default Header;
