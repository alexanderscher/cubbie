"use client";
import { subscriptionCheck } from "@/actions/stripe/subcriptionCheck";
import RegularButton from "@/components/buttons/RegularButton";
import Loading from "@/components/loading-components/Loading";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const StripeRedirectSuccess = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkSub = async () => {
      try {
        setIsLoading(true);
        const check = await subscriptionCheck();
        if (check && check.subscriptionId) {
          await getSession().then((session) => {
            console.log("Session refreshed", session);
          });
          router.push(`/subscription/success/${check.subscriptionId}`);
        } else {
          // Handle no subscription found
          setError(true);
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
      {error && (
        <div className="flex justify-center items-center h-[80vh]">
          <div className="bg-white p-20 rounded-xl shadow max-w-lg mx-auto">
            <div className=" max-w-md m-auto flex-col flex  gap-4  items-center ">
              <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
                <ExclamationTriangleIcon className=" text-red-500 w-3/4 h-1/2" />
              </div>
              <h2 className="text-xl font-semibold text-red-500">Error</h2>
              <div className="mt-3 text-sm text-red-500 text-center">
                <p>
                  We encountered an issue fetching your subscription details.
                  Please contact support.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <RegularButton
                styles={"w-full text-white bg-red-500 border-red-500 "}
                href="/"
              >
                <p className="text-sm">Home</p>
              </RegularButton>
              <RegularButton
                styles={"w-full text-white bg-red-500 border-red-500 "}
                href="mailto:alex@cubbie.io"
              >
                <p className="text-sm">Contact Support</p>
              </RegularButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StripeRedirectSuccess;
