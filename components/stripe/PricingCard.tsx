"use client";
import React, { useState, useTransition } from "react";
import RegularButton from "@/components/buttons/RegularButton";
import {
  handlePayment,
  handlePaymentIndividual,
} from "@/actions/stripe/payment";
import Loading from "@/components/Loading/Loading";

interface priceProps {
  price: any;
  session: any;
}

const PricingCard = ({ price, session }: priceProps) => {
  const changeSubscription = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // try {
    //   if (!session.user.id) {
    //     setNoSession(true);
    //   } else {
    //     const { data } = await axios.post(
    //       "/api/stripe/subscription-change",
    //       {
    //         subscriptionID: subscriptionID,
    //         priceId: price.id,
    //       },
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     window.location.assign(data);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubscription = async () => {
    startTransition(async () => {
      try {
        if (parseInt(price.product.metadata.planId) === 3) {
          const stripeUrl = await handlePaymentIndividual(
            price.id,
            "1",
            price.product.metadata.planId
          );
          if (stripeUrl) {
            window.location.assign(stripeUrl);
          } else {
            throw new Error("Failed to create payment session");
          }
        } else {
          const stripeUrl = await handlePayment(
            price.id,
            price.product.metadata.planId
          );
          if (stripeUrl) {
            window.location.assign(stripeUrl);
          } else {
            throw new Error("Failed to create payment session");
          }
        }
      } catch (error) {
        setError("Failed to create payment session");
      }
    });
  };

  return (
    <div className=" bg-white w-full shadow rounded-lg p-6 flex flex-col gap-3">
      <div className="flex gap-1 text-emerald-900">
        <h1 className={`text-xl`}>{price.product.name}</h1>
      </div>

      <p className="text-lg text-emerald-900 ">
        {(price.unit_amount / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        {"/month"}
      </p>
      {price.product.name === "Free Plan" && <FreePlan />}
      {price.product.name === "All Project Plan" && <AllProjectPlan />}
      {price.product.name === "Individual Project Plan" && <IndividualPlan />}
      <SubButton
        userPlanId={session.user.planId}
        pricePlanId={price.product.metadata.planId}
        handleSubscription={handleSubscription}
      />

      {/* {userSub === price.nickname && sessionId ? (
        <h1 className="text-xl text-red-300">Current subscription</h1>
      ) : currentPage === "/profile/subscription" ? (
        <button
          className="text-xl hover:line-through text-red-500"
          onClick={changeSubscription}
        >
          Subscribe
        </button>
      ) : (
        <button
          className="text-xl hover:line-through text-red-500"
          onClick={handleSubscription}
        >
          Subscribe
        </button>
      )} */}
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};

export default PricingCard;

const FreePlan = () => {
  return (
    <div className="text-orange-400 text-sm">
      <p>Free</p>
      <p>Up to 50 receipt items</p>
      <p>Barcode look up</p>
    </div>
  );
};

const AllProjectPlan = () => {
  return (
    <div className="text-orange-400 text-sm">
      <p>Ulimited items</p>
      <p>Barcode look up</p>
      <p>AI features for all projects </p>
      <p>Receipt return alerts</p>
    </div>
  );
};

const IndividualPlan = () => {
  return (
    <div className="text-orange-400 text-sm">
      <p>Up to 200 items</p>
      <p>Barcode look up</p>
      <p>AI features for subscribed project</p>
      <p>Receipt return alerts for subscribed project</p>
    </div>
  );
};

const SubButton = ({
  userPlanId,
  pricePlanId,
  handleSubscription,
}: {
  userPlanId: number;
  pricePlanId: string;
  handleSubscription: (pricePlanId: string) => void;
}) => {
  return (
    <RegularButton
      handleClick={() => handleSubscription(pricePlanId)}
      styles={
        userPlanId !== parseInt(pricePlanId)
          ? "text-sm border-emerald-900 text-emerald-900"
          : "text-sm border-slate-400 text-slate-400"
      }
    >
      {userPlanId !== parseInt(pricePlanId) ? "Subscribe" : "Current Plan"}
    </RegularButton>
  );
};
