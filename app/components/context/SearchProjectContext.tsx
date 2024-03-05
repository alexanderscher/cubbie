"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

import { useEffect } from "react";
import { Project } from "@/types/receipt";

interface SearchProjectContextType {
  filteredProjectData: Project[];
  setFilteredProjectData: React.Dispatch<React.SetStateAction<Project[]>>;
  isProjectLoading: boolean;
  setisProjectLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  isProjectRefresh: boolean;
}

export const SearchProjectContext = createContext<SearchProjectContextType>({
  filteredProjectData: [],
  setFilteredProjectData: () => {},
  isProjectLoading: true,
  setisProjectLoading: () => {},
  setProjectRefresh: () => {},
  isProjectRefresh: false,
});

export const useSearchProjectContext = () => useContext(SearchProjectContext);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProjectProvider: React.FC<SearchProviderProps> = ({
  children,
}) => {
  const [filteredProjectData, setFilteredProjectData] = useState<Project[]>([]);
  const [isProjectLoading, setisProjectLoading] = useState(true);
  const [isProjectRefresh, setProjectRefresh] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setFilteredProjectData([]);
  }, [pathname]);

  return (
    <SearchProjectContext.Provider
      value={{
        filteredProjectData,
        setFilteredProjectData,
        isProjectLoading,
        setisProjectLoading,
        setProjectRefresh,
        isProjectRefresh,
      }}
    >
      {children}
    </SearchProjectContext.Provider>
  );
};
