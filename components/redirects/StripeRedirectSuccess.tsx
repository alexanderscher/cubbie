"use client";
import { subscriptionCheck } from "@/actions/stripe/subcriptionCheck";
import Loading from "@/components/loading/Loading";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StripeRedirectSuccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const checkSub = async () => {
      setIsLoading(true);
      const check = await subscriptionCheck();

      if (check) {
        getSession().then((session) => {
          console.log("Session refreshed", session);
        });
        router.push(`/subscription/success/${check.subscriptionId}`);
      }
    };
    checkSub();
  }, [router]);

  return (
    <div className="flex flex-col items-center pb-[400px]">
      {isLoading && (
        <div>
          <Loading loading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default StripeRedirectSuccess;
