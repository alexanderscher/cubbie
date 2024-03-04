"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { useEffect } from "react";
import { Receipt } from "@/types/receipt";

interface SearchContextType {
  filteredData: Receipt[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFilteredData: React.Dispatch<React.SetStateAction<Receipt[]>>;
  isReceiptRefreshed: boolean;
  setIsReceiptRefreshed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchContext = createContext<SearchContextType>({
  filteredData: [],
  isLoading: true,
  setIsLoading: () => {},
  setFilteredData: () => {},
  isReceiptRefreshed: false,
  setIsReceiptRefreshed: () => {},
});

export const useSearchContext = () => useContext(SearchContext);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [filteredData, setFilteredData] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReceiptRefreshed, setIsReceiptRefreshed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setFilteredData([]);
  }, [pathname]);

  return (
    <SearchContext.Provider
      value={{
        filteredData,
        setFilteredData,
        isLoading,
        setIsLoading,
        isReceiptRefreshed,
        setIsReceiptRefreshed,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
