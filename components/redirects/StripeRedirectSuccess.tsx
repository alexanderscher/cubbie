"use client";
import { subscriptionCheck } from "@/actions/stripe/subcriptionCheck";
import Loading from "@/components/loading-components/Loading";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const StripeRedirectSuccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const checkSub = async () => {
      try {
        const check = await subscriptionCheck();
        if (check && check.subscriptionId) {
          await getSession().then((session) => {
            console.log("Session refreshed", session);
          });
          router.push(`/subscription/success/${check.subscriptionId}`);
        } else {
          // Handle no subscription found
          console.log("No active subscription found.");
        }
      } catch (error) {
        console.error("Failed to check subscription:", error);
      } finally {
        setIsLoading(false);
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
