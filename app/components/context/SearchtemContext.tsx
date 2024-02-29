"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { useEffect } from "react";
import { Item } from "@/types/receipt";

interface SearchItemContextType {
  filteredItemData: Item[];
  setFilteredItemData: React.Dispatch<React.SetStateAction<Item[]>>;
  refreshData: boolean;
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchItemContext = createContext<SearchItemContextType>({
  filteredItemData: [],
  setFilteredItemData: () => {},
  refreshData: false,
  setRefreshData: () => {},
});

export const useSearchItemContext = () => useContext(SearchItemContext);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchItemProvider: React.FC<SearchProviderProps> = ({
  children,
}) => {
  const [filteredItemData, setFilteredItemData] = useState<Item[]>([]);
  const [refreshData, setRefreshData] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setFilteredItemData([]);
  }, [pathname]);

  return (
    <SearchItemContext.Provider
      value={{
        filteredItemData,
        setFilteredItemData,
        refreshData,
        setRefreshData,
      }}
    >
      {children}
    </SearchItemContext.Provider>
  );
};
