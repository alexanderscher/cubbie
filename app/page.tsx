import Projects from "@/components/Home/Projects";
import { SearchProjectProvider } from "@/components/context/SearchProjectContext";
import Header from "@/components/headers/Header";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getProjects } from "@/lib/projectsDB";
import { Project } from "@/types/receiptTypes";
import { Suspense } from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as Project[];
};

export default async function Home() {
  const projects = await fetchProject();

  return (
    <PageWrapper>
      <SearchProjectProvider>
        <div className="flex flex-col pb-[400px]">
          <Suspense fallback={<div>Loading</div>}>
            <Header type="Projects" />
            <Projects serverData={projects} />
          </Suspense>
        </div>
      </SearchProjectProvider>
    </PageWrapper>
  );
}
