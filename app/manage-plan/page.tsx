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
                <h1>Upgrading</h1>
                <p>
                  You can upgrade your plan at anytime by clicking the “Purchase
                  now” or “14-day free trial” buttons. If you are upgrading from
                  the free plan, you will need a valid credit card to start the
                  trial. Your credit card will be charged only after the trial
                  period ends.
                </p>
              </div>
              <div className="bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
                <h1>Downgrading</h1>
                <p>
                  To downgrade your plan, you will need to meet the limits of
                  the lower plan to which you wish to downgrade. A downgrade
                  button will only be available to click on if you meet the plan
                  limits for a lower tier. You can find a list of limits for all
                  plans available here. When downgrading to the Cubbie Free
                  plan, you’ll have access to your current plan until the next
                  billing cycle. At the end of the billing cycle, your account
                  will be downgraded, and your credit card will no longer be
                  charged. When downgrading from Cubbie Advanced to Cubbie
                  Limited, your plan will be downgraded immediately and you’ll
                  get credit which will be applied to future payments. A
                  downgrade button will only be available to click on if you
                  meet the plan limits for the lower tier. You can find a list
                  of limits for all plans available here.
                </p>
              </div>
              <div className="bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
                <h1>Invitations</h1>
                <p>
                  If you are subscribed to a plan, you can invite other users to
                  join your project, allowing them to access the benefits of
                  your subscription. Similarly, if someone else has a
                  subscription, they can invite you to their project. To send or
                  accept an invitation, navigate to the ‘Project Settings’ page
                  and use the ‘Invite Members’ option.
                </p>
                <p>
                  Invitations are managed through your project dashboard. An
                  email will be sent to the invited user’s registered email.
                </p>
              </div>
              <div className="bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
                <h1>Cancellation</h1>
                <p>
                  If you no longer wish to use a paid Cubbie plan, you have a
                  few options. You can downgrade to the Cubbie Free plan. The
                  downgrade button will only be available to click on if you
                  meet the plan limits for the Cubbie Free plan. You can find a
                  list of limits for all plans available here. Or you can delete
                  your account and its associated data.
                </p>
              </div>
              <div className="bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
                <h1>Deleting account</h1>
                <p>
                  To permanently delete your account and remove all the data, go
                  to the Manage Account settings section below. Once your
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
