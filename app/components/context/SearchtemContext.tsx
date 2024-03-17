"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { useEffect } from "react";
import { Item } from "@/types/receiptTypes";

interface SearchItemContextType {
  filteredItemData: Item[];
  setFilteredItemData: React.Dispatch<React.SetStateAction<Item[]>>;
  refreshData: boolean;
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
  isItemLoading: boolean;
  setisItemLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchItemContext = createContext<SearchItemContextType>({
  filteredItemData: [],
  setFilteredItemData: () => {},
  refreshData: false,
  setRefreshData: () => {},
  isItemLoading: true,
  setisItemLoading: () => {},
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
  const [isItemLoading, setisItemLoading] = useState(true);
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
        isItemLoading,
        setisItemLoading,
      }}
    >
      {children}
    </SearchItemContext.Provider>
  );
};
