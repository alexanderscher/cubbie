"use client";
import ReactSelect, { StylesConfig } from "react-select";
import { useSession } from "next-auth/react";
import { ProjectType, ProjectUserArchiveType } from "@/types/ProjectTypes";
import { FormError } from "@/components/form-error";
import React, { useState, useTransition } from "react";
import RegularButton from "@/components/buttons/RegularButton";
import { freePlan, handlePayment } from "@/actions/stripe/payment";
import Loading from "@/components/Loading/Loading";
import ErrorModal from "@/components/modals/ErrorModal";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { useRouter } from "next/navigation";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { User } from "@prisma/client";
import { checkDowngrade } from "@/actions/downgrade/check";

interface priceProps {
  price: any;
  session: any;
  user: User;
}

const PricingCard = ({ price, session, user }: priceProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [cancelPrompt, setCancelPrompt] = useState(false);
  const router = useRouter();

  const handleSubscription = async () => {
    setCancelPrompt(false);
    startTransition(async () => {
      try {
        if (parseInt(price.product.metadata.planId) === 1) {
          setError("");
          try {
            const unsubscribe = await freePlan();
            if (unsubscribe) {
              router.push("subscription/cancel");
            } else {
              throw new Error("Failed to unsubscribe from free plan");
            }
          } catch (e) {
            setError("Failed to subscribe to free plan");
          }
        } else {
          setError("");
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
    <div className=" bg-white w-full shadow rounded-lg p-8 flex flex-col gap-3">
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
      {price.product.name === "Advanced Project Plan" && <AllProjectPlan />}
      {price.product.name === "Limited Project Plan" && <LimitedProjectPlan />}

      <SubButton
        userPlanId={session.user.planId}
        pricePlanId={price.product.metadata.planId}
        handleSubscription={handleSubscription}
        setCancelPrompt={setCancelPrompt}
        user={user}
        setErrorModal={setErrorModal}
        errorModal={errorModal}
      />

      {isPending && <Loading loading={isPending} />}
      {error && <FormError message={error}></FormError>}

      {cancelPrompt && (
        <ModalOverlay onClose={() => setCancelPrompt(false)}>
          <div className="bg-white p-20 rounded-xl shadow max-w-lg mx-auto text-center">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="bg-orange-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
                <ExclamationTriangleIcon className=" text-orange-600 w-3/4 h-1/2" />
              </div>
              <h1 className="text-orange-600">
                {" "}
                Are you sure you want to downgrade to the free plan?
              </h1>
              <h1>{session.subscription}</h1>

              <RegularButton
                handleClick={() => handleSubscription()}
                styles={
                  "text-sm border-orange-600 bg-orange-600 text-white w-full"
                }
              >
                Confirm
              </RegularButton>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
};

export default PricingCard;

const FreePlan = () => {
  return (
    <div className="text-slate-400 text-sm">
      <p>Free</p>
      <p>Up to 20 receipt items per prioject</p>
      <p>Barcode look up</p>
      <p>Two users per project</p>
    </div>
  );
};

const LimitedProjectPlan = () => {
  return (
    <div className="text-slate-400 text-sm">
      <p>Up to 50 receipt items per project</p>
      <p>Up to 5 users per project</p>
      <p>Barcode look up</p>
      <p>Up to ten AI features per week for all projects </p>
      <p>Return alerts</p>
    </div>
  );
};

const AllProjectPlan = () => {
  return (
    <div className="text-slate-400 text-sm">
      <p>Ulimited receipt items per project</p>
      <p>Unlimited users per project</p>
      <p>Barcode look up</p>
      <p>Unlimited AI features for all projects </p>
      <p>Return alerts</p>
    </div>
  );
};

const SubButton = ({
  userPlanId,
  pricePlanId,
  handleSubscription,
  setCancelPrompt,
  user,
  setErrorModal,
  errorModal,
}: {
  userPlanId: number;
  pricePlanId: string;
  handleSubscription: () => void;
  setCancelPrompt?: (value: boolean) => void;
  user: User;
  setErrorModal: (value: boolean) => void;
  errorModal: boolean;
}) => {
  if (parseInt(pricePlanId) === 1 && setCancelPrompt) {
    return (
      <RegularButton
        handleClick={async () => {
          if (userPlanId !== parseInt(pricePlanId)) {
            const check = await checkDowngrade(
              userPlanId,
              parseInt(pricePlanId)
            );

            if (check.items === 0 && check.users.length === 0) {
              setCancelPrompt(true);
            } else {
              setErrorModal(true);
            }
          }
        }}
        styles={
          userPlanId === parseInt(pricePlanId) || userPlanId === null
            ? " text-sm border-slate-400 text-slate-400"
            : "text-sm border-orange-600 bg-orange-600 text-white"
        }
      >
        {userPlanId === parseInt(pricePlanId) || userPlanId === null
          ? "Current Plan"
          : "Downgrade"}
      </RegularButton>
    );
  } else if (parseInt(pricePlanId) === 2) {
    const hasUsedTrialAdvanced = user.hasUsedTrialAdvanced;

    return (
      <RegularButton
        handleClick={async () => {
          if (userPlanId !== parseInt(pricePlanId)) {
            const check = await checkDowngrade(
              userPlanId,
              parseInt(pricePlanId)
            );
            if (check.items === 0 && check.users.length === 0) {
              handleSubscription();
            } else {
              setErrorModal(true);
            }
          }
        }}
        styles={
          userPlanId !== parseInt(pricePlanId)
            ? "text-sm border-orange-600 bg-orange-600 text-white"
            : "text-sm border-slate-400 text-slate-400"
        }
      >
        {userPlanId !== parseInt(pricePlanId)
          ? hasUsedTrialAdvanced
            ? "Subscribe"
            : "14 day free trial"
          : "Current Plan"}
      </RegularButton>
    );
  } else if (parseInt(pricePlanId) === 3) {
    const hasUsedTrialLimited = user.hasUsedTrialLimited;

    return (
      <RegularButton
        handleClick={async () => {
          if (userPlanId !== parseInt(pricePlanId)) {
            const check = await checkDowngrade(
              userPlanId,
              parseInt(pricePlanId)
            );
            if (check.items === 0 && check.users.length === 0) {
              handleSubscription();
            } else {
              setErrorModal(true);
            }
          }
        }}
        styles={
          userPlanId !== parseInt(pricePlanId)
            ? "text-sm border-orange-600 bg-orange-600 text-white"
            : "text-sm border-slate-400 text-slate-400"
        }
      >
        {userPlanId !== parseInt(pricePlanId)
          ? hasUsedTrialLimited
            ? "Subscribe"
            : "14 day free trial"
          : "Current Plan"}
      </RegularButton>
    );
  }
};

const DowngradeErrorModal = ({}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 z-[2000] flex justify-center items-center"
      onClick={(e) => e.preventDefault()}
    >
      <h2 className="text-xl font-semibold text-red-500">Upload Error</h2>
    </div>
  );
};
