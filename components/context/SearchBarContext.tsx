"use client";
import { ProjectType } from "@/types/ProjectTypes";
import { ReceiptType } from "@/types/ReceiptTypes";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchBarContextType {
  searchBarOpen: boolean;
  setSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  filteredItems: any[];
  setFilteredItems: React.Dispatch<React.SetStateAction<any[]>>;
  filteredReceipts: ReceiptType[];
  setFilteredReceipts: React.Dispatch<React.SetStateAction<ReceiptType[]>>;
  filteredProjects: ProjectType[];
  setFilteredProjects: React.Dispatch<React.SetStateAction<ProjectType[]>>;
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
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);

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
