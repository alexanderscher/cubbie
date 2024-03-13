import React, { useState, useEffect } from "react";
import { useSearchProjectContext } from "@/app/components/context/SearchProjectContext";
import { useSearchContext } from "@/app/components/context/SearchContext";
import { usePathname } from "next/navigation";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";

interface Props {
  searchType: string;
}

function SearchBar({ searchType }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const { filterProjects } = useSearchProjectContext();
  // const { setFilteredData } = useSearchContext();
  // const { setFilteredItemData } = useSearchItemContext();

  useEffect(() => {
    setSearchTerm("");
  }, [pathname]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (pathname === "/") {
      filterProjects(newSearchTerm);
    }
    // } else if (pathname.includes("receipts")) {
    //   setFilteredData(newSearchTerm);
    // } else if (pathname.includes("items")) {
    //   setFilteredItemData(newSearchTerm);
    // }
  };

  return (
    <div className="w-full">
      <input
        className="searchBar border-[1px] border-black placeholder:text-slate-400 placeholder:text-xs flex items-center text-sm text-black p-3"
        placeholder={`Search ${
          searchType === "Receipts"
            ? "receipt by store name"
            : searchType === "Items"
            ? "item by description, barcode, or product id"
            : "projects"
        }`}
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
}

export default SearchBar;
