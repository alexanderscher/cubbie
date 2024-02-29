// Assuming "use client" is at the top of your file.
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Item, Receipt } from "@/types/receipt"; // Ensure these types are correctly imported

interface SearchBarContextType {
  searchBarOpen: boolean;
  setSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: Item[]; // Assuming Item is the type you've defined
  setFilteredItems: React.Dispatch<React.SetStateAction<Item[]>>;
  filteredReceipts: Receipt[]; // Assuming Receipt is the type you've defined
  setFilteredReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
}

export const SearchBarContext = createContext<SearchBarContextType>({
  searchBarOpen: false,
  setSearchBarOpen: () => {},
  searchInput: "",
  setSearchInput: () => {},
  filteredItems: [],
  setFilteredItems: () => {},
  filteredReceipts: [],
  setFilteredReceipts: () => {},
});

export const useSearchBarContext = () => useContext(SearchBarContext);

interface SearchBarProviderProps {
  children: ReactNode;
}

export const SearchBarContextProvider: React.FC<SearchBarProviderProps> = ({
  children,
}) => {
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);

  return (
    <SearchBarContext.Provider
      value={{
        searchBarOpen,
        setSearchBarOpen,
        searchInput,
        setSearchInput,
        filteredItems,
        setFilteredItems,
        filteredReceipts,
        setFilteredReceipts,
      }}
    >
      {children}
    </SearchBarContext.Provider>
  );
};
