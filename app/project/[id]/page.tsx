import { auth } from "@/auth";
import { ProjectId } from "@/components/project/ProjectId";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getProjectById } from "@/lib/projectsDB";
import { Project } from "@/types/AppTypes";
import { Session } from "next-auth";

const fetchProject = async (id: string) => {
  const project = await getProjectById(id);
  return project as Project;
};

export default async function ProjectID({
  params,
}: {
  params: { id: string };
}) {
  const session = (await auth()) as Session;
  const project = await fetchProject(params.id);
  console.log(project);

  return (
    <PageWrapper>
      <div className="w-full flex justify-center ">
        <ProjectId projectId={params.id} sessionUserId={session.user.id} />
      </div>
    </PageWrapper>
  );
}
