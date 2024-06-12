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
import { getProjectsClient } from "@/lib/getProjectsClient";

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
}

const fetchProjectData = async () => {
  const projects = await getProjectsClient();
  return projects as ProjectType[];
};

export const SearchProjectContext = createContext<SearchProjectContextType>(
  {} as SearchProjectContextType
);

export const useSearchProjectContext = () => useContext(SearchProjectContext);

export const SearchProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [filteredProjectData, setFilteredProjectData] = useState<ProjectType[]>(
    []
  );
  const [isProjectLoading, setisProjectLoading] = useState(true);
  const [isProjectRefresh, setProjectRefresh] = useState(false);

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

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
      }}
    >
      {children}
    </SearchProjectContext.Provider>
  );
};

// "use client";
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useCallback,
// } from "react";
// import { usePathname } from "next/navigation";
// import { ProjectType } from "@/types/ProjectTypes";

// interface SearchProjectContextType {
//   projects: ProjectType[];
//   filteredProjectData: ProjectType[];
//   initializeProjects: (data: ProjectType[]) => void; // Initializes projects data
//   filterProjects: (searchTerm: string) => void; // Filters projects based on a search term
//   isProjectLoading: boolean; // Indicates if the project data is currently loading
//   setisProjectLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   isProjectRefresh: boolean; // Optional: Tracks if the projects data needs refreshing
//   setProjectRefresh: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export const SearchProjectContext = createContext<SearchProjectContextType>(
//   {} as SearchProjectContextType
// );

// export const useSearchProjectContext = () => useContext(SearchProjectContext);

// export const SearchProjectProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [projects, setProjects] = useState<ProjectType[]>([]);
//   const [filteredProjectData, setFilteredProjectData] = useState<ProjectType[]>(
//     []
//   );
//   const [isProjectLoading, setisProjectLoading] = useState(true);
//   const [isProjectRefresh, setProjectRefresh] = useState(false);
//   const pathname = usePathname();

//   const initializeProjects = useCallback((data: ProjectType[]) => {
//     setProjects(data);
//     setFilteredProjectData(data);
//     setisProjectLoading(false);
//   }, []);

//   const filterProjects = (searchTerm: string) => {
//     if (!searchTerm) {
//       setFilteredProjectData(projects);
//     } else {
//       const filtered = projects.filter((project) =>
//         project.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );

//       setFilteredProjectData(filtered);
//     }
//   };

//   useEffect(() => {
//     setFilteredProjectData(projects);
//   }, [pathname, projects]);

//   return (
//     <SearchProjectContext.Provider
//       value={{
//         projects,
//         filteredProjectData,
//         initializeProjects,
//         filterProjects,
//         isProjectLoading,
//         setisProjectLoading,
//         isProjectRefresh,
//         setProjectRefresh,
//       }}
//     >
//       {children}
//     </SearchProjectContext.Provider>
//   );
// };
