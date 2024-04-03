import { auth } from "@/auth";
import { ProjectId } from "@/components/project/ProjectId";
import PageWrapper from "@/components/wrapper/PageWrapper";
import prisma from "@/prisma/client";
import { Project } from "@/types/AppTypes";
import { Session } from "next-auth";

const getProjectById = async (id: string) => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;

  const project = await prisma.project.findUnique({
    where: {
      userId,
      id: parseInt(id),
    },
    include: {
      receipts: {
        include: {
          items: true,
          project: true,
        },
      },
    },
  });

  return project;
};

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
      <div className="w-full flex justify-center ">
        <ProjectId project={project} />
      </div>
    </PageWrapper>
  );
}
