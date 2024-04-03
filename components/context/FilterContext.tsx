"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

interface FilterType {
  isFilterOpen: boolean;
  setFilterOpen: () => void;
}

export const FilterContext = createContext<FilterType>({} as FilterType);

export const useFilterContext = () => useContext(FilterContext);

export const FilterContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isFilterOpen, setFilterOpen] = useState(false);

  return (
    <FilterContext.Provider
      value={{
        isFilterOpen,
        setFilterOpen: () => setFilterOpen(!isFilterOpen),
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
