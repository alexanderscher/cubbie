import { auth } from "@/auth";
import { SearchProjectProvider } from "@/components/context/SearchProjectContext";
import { SearchReceiptProvider } from "@/components/context/SearchReceiptContext";
import { ProjectId } from "@/components/project/ProjectId";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { Session } from "@/types/Session";

export default async function ProjectID({}) {
  const session = (await auth()) as Session;

  return (
    <SearchProjectProvider>
      <SearchReceiptProvider>
        <PageWrapper>
          <div className="w-full flex justify-center ">
            <ProjectId session={session} />
          </div>
        </PageWrapper>
      </SearchReceiptProvider>
    </SearchProjectProvider>
  );
}
