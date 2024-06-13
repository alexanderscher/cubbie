"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { ProjectType } from "@/types/ProjectTypes";
import {
  getProjectByIdClient,
  getProjectsClient,
} from "@/lib/getProjectsClient";
import { usePathname } from "next/navigation";

interface SearchProjectContextType {
  projects: ProjectType[];
  filteredProjectData: ProjectType[];
  initializeProjects: (data: ProjectType[]) => void;
  fetchProjects: () => Promise<void>;
  filterProjects: (searchTerm: string) => void;
  isProjectLoading: boolean;
  setisProjectLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isProjectRefresh: boolean;
  setProjectRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  fetchProjectById: () => Promise<void>;
  project: ProjectType;
  reloadProjects: () => void;
}

const fetchProjectData = async () => {
  const projects = await getProjectsClient();
  return projects as ProjectType[];
};

const fetchProjcectById = async (id: string) => {
  const project = await getProjectByIdClient(id);
  return project as ProjectType;
};

export const SearchProjectContext = createContext<SearchProjectContextType>(
  {} as SearchProjectContextType
);

export const useSearchProjectContext = () => useContext(SearchProjectContext);

export const SearchProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [filteredProjectData, setFilteredProjectData] = useState<ProjectType[]>(
    []
  );
  const [isProjectLoading, setisProjectLoading] = useState(true);
  const [isProjectRefresh, setProjectRefresh] = useState(false);
  const [project, setProject] = useState<ProjectType>({} as ProjectType);

  const initializeProjects = useCallback((data: ProjectType[]) => {
    setProjects(data);
    setFilteredProjectData(data);
    setisProjectLoading(false);
  }, []);

  const fetchProjects = useCallback(async () => {
    setisProjectLoading(true);
    try {
      const projects = await fetchProjectData();
      initializeProjects(projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setisProjectLoading(false);
    }
  }, [initializeProjects]);

  const filterProjects = useCallback(
    (searchTerm: string) => {
      if (!searchTerm) {
        setFilteredProjectData(projects);
      } else {
        const filtered = projects.filter((project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjectData(filtered);
      }
    },
    [projects]
  );

  const fetchProjectById = useCallback(async () => {
    setisProjectLoading(true);
    try {
      const project = await fetchProjcectById(pathname.split("/project/")[1]);
      setProject(project);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setisProjectLoading(false);
    }
  }, [pathname]);

  const reloadProjects = () => {
    if (pathname === "/") {
      fetchProjects();
    } else {
      fetchProjectById();
    }
  };

  useEffect(() => {
    if (pathname === "/") {
      fetchProjects();
    } else {
      fetchProjectById();
    }
  }, [fetchProjects, fetchProjectById, pathname]);

  return (
    <SearchProjectContext.Provider
      value={{
        projects,
        filteredProjectData,
        initializeProjects,
        fetchProjects,
        filterProjects,
        isProjectLoading,
        setisProjectLoading,
        isProjectRefresh,
        setProjectRefresh,
        fetchProjectById,
        project,
        reloadProjects,
      }}
    >
      {children}
    </SearchProjectContext.Provider>
  );
};
