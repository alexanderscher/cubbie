import { getStripeProducts } from "@/actions/stripe/getProducts";
import { auth } from "@/auth";
import PricingCard from "@/components/stripe/PricingCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { Session } from "@/types/Session";
import React from "react";

const ManagePlan = async () => {
  const prices = await getStripeProducts();
  const session = (await auth()) as Session;

  return (
    <PageWrapper>
      <div className="flex flex-col items-center">
        {/* <Suspense fallback={<div>Loading...</div>}> */}

        <div className="w-full max-w-[800px]">
          <div className="w-full flex items-start">
            <h1 className="text-2xl font-semibold text-center my-8 text-emerald-900">
              Manage plan
            </h1>
          </div>
          <div className="flex flex-col  gap-6">
            {prices &&
              prices.map((price: any) => (
                <PricingCard price={price} key={price.id} session={session} />
              ))}
          </div>
        </div>
        {/* </Suspense> */}
      </div>
    </PageWrapper>
  );
};

export default ManagePlan;
