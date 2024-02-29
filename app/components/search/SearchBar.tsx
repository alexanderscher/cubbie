"use client";
import { useSearchContext } from "@/app/components/context/SearchContext";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

interface Props {
  data: any;
  type: string;
  searchType: string;
}

function SearchBar({ data, type, searchType }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const { setFilteredData } = useSearchContext();
  const { setFilteredItemData } = useSearchItemContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (type === "receipt") {
      if (newSearchTerm.trim() === "") {
        setFilteredData(data);
      } else {
        const newFilteredData = data.filter(
          (item: any) =>
            item.store &&
            item.store.toLowerCase().includes(newSearchTerm.toLowerCase())
        );
        setFilteredData(newFilteredData);
      }
    }
    if (type === "item") {
      if (newSearchTerm.trim() === "") {
        setFilteredItemData(data);
      } else {
        const newFilteredData = data.filter(
          (item: any) =>
            (item.description &&
              item.description
                .toLowerCase()
                .includes(newSearchTerm.toLowerCase())) ||
            (item.barcode &&
              item.barcode
                .toLowerCase()
                .includes(newSearchTerm.toLowerCase())) ||
            (item.product_id &&
              item.product_id
                .toLowerCase()
                .includes(newSearchTerm.toLowerCase())) ||
            (item.receipt.store &&
              item.receipt.store
                .toLowerCase()
                .includes(newSearchTerm.toLowerCase()))
        );
        setFilteredItemData(newFilteredData);
      }
    }
  };

  return (
    <div className="w-full ">
      <div className="w-full">
        <input
          className="searchBar border-[1px] border-black placeholder:text-slate-400  placeholder:text-xs flex items-center text-sm text-black p-3"
          placeholder={`Search ${
            searchType === "Receipts"
              ? "receipt by store name"
              : "item by description, barcode, or product id"
          }`}
          value={searchTerm}
          onChange={handleChange}
        ></input>
      </div>
    </div>
  );
}

export default SearchBar;
