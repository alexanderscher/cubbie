import { auth } from "@/auth";
import Projects from "@/components/Home/Projects";
import { SearchProjectProvider } from "@/components/context/SearchProjectContext";
import Header from "@/components/headers/Header";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getProjects } from "@/lib/projectsDB";
import { Project } from "@/types/AppTypes";
import { Session } from "@/types/AppTypes";
import { Suspense } from "react";

// const fetchProject = async () => {
//   const projects = await getProjects();
//   return projects as Project[];
// };

export default async function Home() {
  // const projects = await fetchProject();
  const session = (await auth()) as Session;

  return (
    <PageWrapper>
      <SearchProjectProvider>
        <div className="flex flex-col items-center pb-[400px]">
          <Suspense fallback={<div>Loading</div>}>
            <div className="w-full max-w-[1090px]">
              <Header type="Projects" />
              <Projects sessionUserId={session.user.id} />
            </div>
          </Suspense>
        </div>
      </SearchProjectProvider>
    </PageWrapper>
  );
}
