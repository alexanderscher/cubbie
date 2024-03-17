import Projects from "@/app/components/Home/Projects";
import { SearchProjectProvider } from "@/app/components/context/SearchProjectContext";
import Header from "@/app/components/headers/Header";
import { getProjects } from "@/app/lib/projectsDB";
import { Project } from "@/types/receiptTypes";

import { Suspense } from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  console.log(projects);
  return projects as Project[];
};

export default async function Home() {
  const projects = await fetchProject();

  return (
    <SearchProjectProvider>
      <main className="flex flex-col pb-[400px]">
        <Suspense fallback={<div>Loading</div>}>
          <Header type="Projects" />
          <Projects serverData={projects} />
        </Suspense>
      </main>
    </SearchProjectProvider>
  );
}
