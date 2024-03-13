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
import { Project } from "@/types/receipt";

interface SearchProjectContextType {
  projects: Project[];
  filteredProjectData: Project[]; // Stores the currently displayed list, which may be filtered
  initializeProjects: (data: Project[]) => void; // Initializes projects data
  filterProjects: (searchTerm: string) => void; // Filters projects based on a search term
  isProjectLoading: boolean; // Indicates if the project data is currently loading
  setisProjectLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isProjectRefresh: boolean; // Optional: Tracks if the projects data needs refreshing
  setProjectRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with default values
export const SearchProjectContext = createContext<SearchProjectContextType>(
  {} as SearchProjectContextType
);

// Custom hook to use the context
export const useSearchProjectContext = () => useContext(SearchProjectContext);

// Context provider component
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
