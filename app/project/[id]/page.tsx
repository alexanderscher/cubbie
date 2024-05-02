import { auth } from "@/auth";
import { ProjectId } from "@/components/project/ProjectId";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getProjectById } from "@/lib/projectsDB";
import { Session } from "next-auth";

export default async function ProjectID({
  params,
}: {
  params: { id: string };
}) {
  const session = (await auth()) as Session;

  return (
    <PageWrapper>
      <div className="w-full flex justify-center ">
        <ProjectId projectId={params.id} sessionUserId={session.user.id} />
      </div>
    </PageWrapper>
  );
}
