import AlertComponent from "@/components/alerts/Alerts";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getAlerts } from "@/lib/alerts";
import { Alert } from "@/types/AppTypes";
import { Suspense } from "react";

const fetchAlert = async () => {
  const alerts = await getAlerts();
  return alerts as Alert[];
};

export default async function Alerts() {
  const alerts = await fetchAlert();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center pb-[400px]">
        <Suspense fallback={<div>Loading</div>}>
          <div className="w-full max-w-[900px]">
            <AlertComponent alerts={alerts} />
          </div>
        </Suspense>
      </div>
    </PageWrapper>
  );
}
