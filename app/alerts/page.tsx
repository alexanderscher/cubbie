import { auth } from "@/auth";
import AlertComponent from "@/components/alerts/Alerts";
import { SearchAlertProvider } from "@/components/context/SearchFilterAlerts";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getAlerts } from "@/lib/alerts";
import { Alert } from "@/types/AppTypes";
import { Session } from "@/types/Session";

import { Suspense } from "react";

const fetchAlert = async () => {
  const alerts = await getAlerts();
  return alerts as Alert[];
};

export default async function Alerts() {
  const alerts = await fetchAlert();
  const session = (await auth()) as Session;

  return (
    <PageWrapper>
      <SearchAlertProvider>
        <div className="flex flex-col items-center pb-[400px]">
          <Suspense fallback={<div>Loading</div>}>
            <div className="w-full max-w-[600px]">
              <AlertComponent alerts={alerts} userId={session.user.id} />
            </div>
          </Suspense>
        </div>
      </SearchAlertProvider>
    </PageWrapper>
  );
}
