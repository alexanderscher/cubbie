"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Item, Project, Receipt } from "@/types/receipt";

interface SearchBarContextType {
  searchBarOpen: boolean;
  setSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: Item[];
  setFilteredItems: React.Dispatch<React.SetStateAction<Item[]>>;
  filteredReceipts: Receipt[];
  setFilteredReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
  filteredProjects: Project[];
  setFilteredProjects: React.Dispatch<React.SetStateAction<Project[]>>;
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
  filteredProjects: [],
  setFilteredProjects: () => {},
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
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

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
        filteredProjects,
        setFilteredProjects,
      }}
    >
      {children}
    </SearchBarContext.Provider>
  );
};
