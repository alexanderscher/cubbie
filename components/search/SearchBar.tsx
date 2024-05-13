"use client";
import React, { useState, useEffect } from "react";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import { usePathname } from "next/navigation";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import { useSearchAlertContext } from "@/components/context/SearchFilterAlerts";

interface Props {
  searchType: string;
}

function SearchBar({ searchType }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const { filterProjects } = useSearchProjectContext();
  const { filterReceipts } = useSearchReceiptContext();
  const { filterItems } = useSearchItemContext();
  const { filterAlerts } = useSearchAlertContext();

  useEffect(() => {
    setSearchTerm("");
  }, [pathname]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (pathname === "/") {
      filterProjects(newSearchTerm);
    } else if (pathname.includes("receipts")) {
      filterReceipts(newSearchTerm);
    } else if (pathname.includes("items")) {
      filterItems(newSearchTerm);
    } else if (pathname.includes("alerts")) {
      filterAlerts(newSearchTerm);
    }
  };

  return (
    <div className="w-full">
      <input
        className="searchBar border-[1px] border-emerald-900 placeholder:text-emerald-900 placeholder:text-xs flex items-center text-sm text-emerald-900 p-3"
        placeholder={`Search ${
          searchType === "Receipts"
            ? "receipt by store name"
            : searchType === "Items"
            ? "item by name, barcode, or product id"
            : searchType === "Alerts"
            ? "alerts by store name"
            : "projects"
        }`}
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;
