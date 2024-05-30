import { getSubscription } from "@/actions/subscriptions/getSubscription";
import SuccessRedirect from "@/components/redirects/SuccessRedirect";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { Subscription } from "@prisma/client";

const getSubscriptionId = async (id: string) => {
  const sub = await getSubscription(id);

  return sub as Subscription | undefined;
};

const SuccessPage = async ({ params }: { params: { id: string } }) => {
  const subscription = await getSubscriptionId(params.id);

  return (
    <PageWrapper>
      <SuccessRedirect subscription={subscription} />
    </PageWrapper>
  );
};

export default SuccessPage;
