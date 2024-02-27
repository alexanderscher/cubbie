"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchBarContextType {
  searchBarOpen: boolean;
  setSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchBarContext = createContext<SearchBarContextType>({
  searchBarOpen: false,
  setSearchBarOpen: () => {},
});

export const useSearchBarContext = () => useContext(SearchBarContext);

interface SearchBarProps {
  children: ReactNode;
}

export const SearchBarContextProvider: React.FC<SearchBarProps> = ({
  children,
}) => {
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  return (
    <SearchBarContext.Provider value={{ searchBarOpen, setSearchBarOpen }}>
      {children}
    </SearchBarContext.Provider>
  );
};
