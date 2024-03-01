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
}

export const SearchProjectContext = createContext<SearchProjectContextType>({
  filteredProjectData: [],
  setFilteredProjectData: () => {},
  isProjectLoading: true,
  setisProjectLoading: () => {},
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
      }}
    >
      {children}
    </SearchProjectContext.Provider>
  );
};
