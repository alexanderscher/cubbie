import PageWrapper from "@/components/wrapper/PageWrapper";
import { getAlerts } from "@/lib/alerts";
import { Alert } from "@/types/AppTypes";

const fetchAlert = async () => {
  const alerts = await getAlerts();
  return alerts as Alert[];
};

export default async function Alerts() {
  const alerts = await fetchAlert();

  return (
    <PageWrapper>
      <div></div>
    </PageWrapper>
  );
}
