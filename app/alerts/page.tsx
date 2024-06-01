import { auth } from "@/auth";
import { AlertHeader } from "@/components/alerts/AlertHeader";
import AlertComponent from "@/components/alerts/Alerts";
import { SearchAlertProvider } from "@/components/context/SearchFilterAlerts";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { Session } from "@/types/Session";

import { Suspense } from "react";

export default async function Alerts() {
  const session = (await auth()) as Session;

  return (
    <PageWrapper>
      {session.user.planId !== 1 && (
        <SearchAlertProvider>
          <div className="flex flex-col items-center pb-[400px]">
            <Suspense fallback={<div>Loading</div>}>
              <div className="w-full max-w-[600px]">
                <AlertComponent userId={session.user.id} />
              </div>
            </Suspense>
          </div>
        </SearchAlertProvider>
      )}
      {session.user.planId === 1 && (
        <div className="flex justify-center items-center w-full">
          <div className="w-full max-w-[900px]">
            <div>
              <AlertHeader planId={session.user.planId} />
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
