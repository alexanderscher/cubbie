import { ProjectId } from "@/app/components/project/ProjectId";
import PageWrapper from "@/app/components/wrapper/PageWrapper";
import { getProjectById } from "@/app/lib/projectsDB";
import { Project } from "@/types/receiptTypes";

const fetchProject = async (id: string) => {
  const project = await getProjectById(id);
  return project as Project;
};

export default async function ProjectID({
  params,
}: {
  params: { id: string };
}) {
  const project = await fetchProject(params.id);

  return (
    <PageWrapper>
      <ProjectId project={project} />
    </PageWrapper>
  );
}
