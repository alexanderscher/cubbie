"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { useEffect } from "react";
import { Receipt } from "@/types/receipt";

interface SearchContextType {
  filteredData: Receipt[];
  setFilteredData: React.Dispatch<React.SetStateAction<Receipt[]>>;
}

export const SearchContext = createContext<SearchContextType>({
  filteredData: [],
  setFilteredData: () => {},
});

export const useSearchContext = () => useContext(SearchContext);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [filteredData, setFilteredData] = useState<Receipt[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    setFilteredData([]);
  }, [pathname]);

  return (
    <SearchContext.Provider value={{ filteredData, setFilteredData }}>
      {children}
    </SearchContext.Provider>
  );
};
