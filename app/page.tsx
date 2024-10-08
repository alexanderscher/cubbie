import { auth } from "@/auth";
import Projects from "@/components/home-components/Projects";
import { SearchProjectProvider } from "@/components/context/SearchProjectContext";
import Header from "@/components/headers/Header";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { Session } from "@/types/Session";
import { Suspense } from "react";
import { retrieveCustomerAndSubscriptionsByEmail } from "@/actions/stripe/getStripeUser";

export default async function Home() {
  const session = (await auth()) as Session;

  const stripe = await retrieveCustomerAndSubscriptionsByEmail(
    "alexcscher@gmail.com"
  );

  return (
    <PageWrapper>
      <SearchProjectProvider>
        <div className="flex flex-col items-center pb-[400px]">
          <Suspense fallback={<div>Loading</div>}>
            <div className="w-full max-w-[1090px]">
              <Header type="Projects" />
              <Projects session={session} />
            </div>
          </Suspense>
        </div>
      </SearchProjectProvider>
    </PageWrapper>
  );
}
