import { auth } from "@/auth";
import { ProjectId } from "@/components/project/ProjectId";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { Session } from "@/types/Session";

export default async function ProjectID({
  params,
}: {
  params: { id: string };
}) {
  const session = (await auth()) as Session;

  return (
    <PageWrapper>
      <div className="w-full flex justify-center ">
        <ProjectId projectId={params.id} session={session} />
      </div>
    </PageWrapper>
  );
}
