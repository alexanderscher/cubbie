"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

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

  const handleSubscription = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // e.preventDefault();
    // if (!sessionId) {
    //   setNoSession(true);
    // } else {
    //   const { data } = await axios.post(
    //     "/api/stripe/payment",
    //     {
    //       priceId: price.id,
    //       subscriptionID: subscriptionID,
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   window.location.assign(data);
    // }
  };

  //   if (isLoading) {
  //     return <Loader />;
  //   }

  return (
    <div className=" bg-white w-full shadow rounded-lg p-6">
      <div className="flex gap-1">
        <h1 className={`text-xl`}>{price.product.name}</h1>
      </div>

      <p className="text-xl text-slate-500">
        {(price.unit_amount / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        {"/month"}
      </p>
      {price.product.name === "Free Plan" && <FreePlan />}
      {price.product.name === "All Project Plan" && <AllProjectPlan />}
      {price.product.name === "Individual Project Plan" && <IndividualPlan />}

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
    </div>
  );
};

export default PricingCard;

const FreePlan = () => {
  return (
    <div>
      <p>Free</p>
      <p>Up to 50 receipt items</p>
      <p>Barcode look up</p>
    </div>
  );
};

const AllProjectPlan = () => {
  return (
    <div>
      <p>Ulimited items</p>
      <p>Barcode look up</p>
      <p>AI features for all projects </p>
      <p>Receipt return alerts</p>
    </div>
  );
};

const IndividualPlan = () => {
  return (
    <div>
      <p>Up to 200 items</p>
      <p>Barcode look up</p>
      <p>AI features for subscribed project</p>
      <p>Receipt return alerts for subscribed project</p>
    </div>
  );
};
