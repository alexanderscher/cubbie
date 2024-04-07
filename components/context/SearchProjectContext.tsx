"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { Project } from "@/types/AppTypes";

interface SearchProjectContextType {
  projects: Project[];
  filteredProjectData: Project[];
  initializeProjects: (data: Project[]) => void; // Initializes projects data
  filterProjects: (searchTerm: string) => void; // Filters projects based on a search term
  isProjectLoading: boolean; // Indicates if the project data is currently loading
  setisProjectLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isProjectRefresh: boolean; // Optional: Tracks if the projects data needs refreshing
  setProjectRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchProjectContext = createContext<SearchProjectContextType>(
  {} as SearchProjectContextType
);

export const useSearchProjectContext = () => useContext(SearchProjectContext);

export const SearchProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjectData, setFilteredProjectData] = useState<Project[]>([]);
  const [isProjectLoading, setisProjectLoading] = useState(true);
  const [isProjectRefresh, setProjectRefresh] = useState(false);
  const pathname = usePathname();

  const initializeProjects = useCallback((data: Project[]) => {
    setProjects(data);
    setFilteredProjectData(data);
    setisProjectLoading(false);
  }, []);

  const filterProjects = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredProjectData(projects);
    } else {
      const filtered = projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredProjectData(filtered);
    }
  };

  useEffect(() => {
    setFilteredProjectData(projects);
  }, [pathname, projects]);

  return (
    <SearchProjectContext.Provider
      value={{
        projects,
        filteredProjectData,
        initializeProjects,
        filterProjects,
        isProjectLoading,
        setisProjectLoading,
        isProjectRefresh,
        setProjectRefresh,
      }}
    >
      {children}
    </SearchProjectContext.Provider>
  );
};
