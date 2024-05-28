"use client";
import { getSession } from "next-auth/react";
import { useEffect } from "react";

const StripeRedirectSuccess = () => {
  useEffect(() => {
    getSession().then((session) => {
      console.log("Session refreshed", session);
    });
  }, []);

  return (
    <div className="flex flex-col items-center pb-[400px]">
      Payment processed! Your details have been updated.
    </div>
  );
};

export default StripeRedirectSuccess;
