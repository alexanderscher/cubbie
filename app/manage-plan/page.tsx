import { getStripeProducts } from "@/actions/stripe/getProducts";
import { auth } from "@/auth";
import PricingCard from "@/components/stripe/PricingCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getUserInfo } from "@/lib/userDb";
import { Session } from "@/types/Session";
import { User } from "@prisma/client";
import React from "react";

const getUser = async () => {
  const user = await getUserInfo();
  return user;
};

const ManagePlan = async () => {
  const prices = await getStripeProducts();
  const session = (await auth()) as Session;
  const user = (await getUser()) as User;
  console.log(user);

  return (
    <PageWrapper>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[750px] mb-[200px]">
          <div className="w-full flex items-start">
            <h1 className="text-2xl  text-center my-8 text-emerald-900">
              Manage plan
            </h1>
          </div>
          <div className="flex flex-col  gap-6 ">
            {prices &&
              prices.map((price: any) => (
                <PricingCard
                  price={price}
                  key={price.id}
                  session={session}
                  user={user}
                />
              ))}
          </div>
          <div className="mt-20">
            <h1 className="text-2xl  my-8 text-emerald-900">
              Manage plan options
            </h1>
            <div className="flex flex-col gap-6">
              <div className="bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
                <h1 className="text-orange-600">Upgrading</h1>
                <p>
                  You can upgrade your subscription at any time through Stripe
                  by clicking on either the &quot;Subscribe&quot; or
                  &quot;14-day free trial&quot; buttons. If you&quot;re
                  transitioning from the free plan, you&quot;ll need to enter a
                  valid credit card to begin your trial. Your card will only be
                  charged after the trial period concludes.
                </p>
              </div>
              <div className="bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
                <h1 className="text-orange-600">Downgrading</h1>
                <p>
                  To downgrade your plan in Cubbie, you must first align with
                  the usage limits of the desired lower tier. You will be unable
                  to downgrade unless these limits are met. When moving to the
                  Cubbie Free plan, you continue on your current plan until the
                  next billing cycle, after which your plan changes, and no
                  further charges are applied to your credit card. For
                  downgrades from Cubbie Advanced to Cubbie Limited, the change
                  is immediate, and any resulting credit will be applied to
                  future payments.
                </p>
              </div>
              <div className="bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
                <h1 className="text-orange-600">Invitations</h1>
                <p>
                  If you are subscribed to a plan, you can invite other users to
                  join your project, allowing them to access the benefits of
                  your subscription. Similarly, if someone else has a
                  subscription, they can invite you to their project.
                </p>
                <p>
                  Invitations are managed through your project dashboard. An
                  email will be sent to the invited user’s registered email.
                </p>
              </div>
              <div className="bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
                <h1 className="text-orange-600">Cancellation</h1>
                <p>
                  If you no longer wish to use a paid Cubbie plan, you can
                  downgrade to the Cubbie Free plan. The downgrade will only be
                  available to click on if you meet the plan limits for the
                  Cubbie Free plan. Or you can delete your account and its
                  associated data.
                </p>
              </div>
              <div className="bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
                <h1 className="text-orange-600">Deleting account</h1>
                <p>
                  To permanently delete your account and remove all the data, go
                  to the user profile page in account settings. Once your
                  account is deleted, you will instantly lose access to your
                  account and the data cannot be recovered.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* </Suspense> */}
      </div>
    </PageWrapper>
  );
};

export default ManagePlan;
