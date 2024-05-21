"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface priceProps {
  price: any;
  session: any;
}

const PricingCard = ({ price, session }: priceProps) => {
  const [help, sethelp] = useState(false);
  const [noSession, setNoSession] = useState(false);
  const currentPage = usePathname();

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
    <div className={"mb-10"}>
      <div className="flex gap-1">
        <h1 className={`text-[30px]`}>{price.product.name}</h1>
      </div>

      <p className="text-[30px] text-slate-500">
        {(price.unit_amount / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}{" "}
        {price.nickname === "Yearly Plan" ? "/year" : "/month"}
      </p>

      {price.nickname === "Local Monthly Plan" && help && (
        <>
          <p className="text-sm text-slate-500">Los Angeles residents only.</p>

          <p className="text-sm text-slate-500">
            Pick-up and drop-off for your rentals at our Los Angeles library.
          </p>
        </>
      )}
      {/* {userSub === price.nickname && sessionId ? (
        <h1 className="text-[30px] text-red-300">Current subscription</h1>
      ) : currentPage === "/profile/subscription" ? (
        <button
          className="text-[30px] hover:line-through text-red-500"
          onClick={changeSubscription}
        >
          Subscribe
        </button>
      ) : (
        <button
          className="text-[30px] hover:line-through text-red-500"
          onClick={handleSubscription}
        >
          Subscribe
        </button>
      )} */}
    </div>
  );
};

export default PricingCard;
