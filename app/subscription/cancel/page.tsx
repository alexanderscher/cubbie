"use client";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getSession } from "next-auth/react";
import { useEffect } from "react";

const PostStripeRedirectPage = () => {
  useEffect(() => {
    getSession().then((session) => {
      console.log("Session refreshed", session);
    });
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col items-center pb-[400px]">
        Subscription canceled. Your details have been updated.
      </div>
    </PageWrapper>
  );
};

export default PostStripeRedirectPage;
