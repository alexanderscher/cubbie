"use client";
import ReactSelect, { StylesConfig } from "react-select";
import { useSession } from "next-auth/react";
import { ProjectType, ProjectUserArchiveType } from "@/types/ProjectTypes";
import { FormError } from "@/components/form-error";
import React, { useState, useTransition } from "react";
import RegularButton from "@/components/buttons/RegularButton";
import { freePlan, handlePayment } from "@/actions/stripe/payment";
import Loading from "@/components/loading-components/Loading";
import ErrorModal from "@/components/modals/ErrorModal";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { useRouter } from "next/navigation";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Project, User } from "@prisma/client";
import { checkDowngrade } from "@/actions/downgrade/check";

interface priceProps {
  price: any;
  session: any;
  user: User;
}

const PricingCard = ({ price, session, user }: priceProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
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
              router.push("/subscription/cancel");
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
        isPending={isPending}
        startTransition={startTransition}
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

interface CheckType {
  items: Project[];
  users: Project[];
}

const SubButton = ({
  userPlanId,
  pricePlanId,
  handleSubscription,
  setCancelPrompt,
  user,
  isPending,
  startTransition,
}: {
  userPlanId: number;
  pricePlanId: string;
  handleSubscription: () => void;
  setCancelPrompt?: (value: boolean) => void;
  user: User;
  isPending: boolean;
  startTransition: any;
}) => {
  const [errorModal, setErrorModal] = useState(false);
  const [checkRes, setCheckRes] = useState<CheckType>({ items: [], users: [] });

  const handleClicker = () => {
    startTransition(async () => {
      if (userPlanId !== parseInt(pricePlanId)) {
        const check = await checkDowngrade(userPlanId, parseInt(pricePlanId));
        if (check.items.length === 0 && check.users.length === 0) {
          handleSubscription();
        } else {
          setCheckRes(check);
          setErrorModal(true);
        }
      }
    });
  };

  const handleClickerFree = () => {
    if (setCancelPrompt) {
      startTransition(async () => {
        if (userPlanId !== parseInt(pricePlanId)) {
          const check = await checkDowngrade(userPlanId, parseInt(pricePlanId));

          if (check.items.length === 0 && check.users.length === 0) {
            setCancelPrompt(true);
          } else {
            setCheckRes(check);
            setErrorModal(true);
          }
        }
      });
    }
  };
  const hasUsedTrialAdvanced = user.hasUsedTrialAdvanced;
  const hasUsedTrialLimited = user.hasUsedTrialLimited;

  const getButtonText = (userPlanId: number | null) => {
    const planIdNum = parseInt(pricePlanId);
    const userPlanIdNum = userPlanId ? userPlanId : null;

    if (planIdNum === userPlanIdNum || userPlanId === null) {
      console.log(planIdNum);
      return "Current Plan";
    } else if (planIdNum === 1) {
      return "Downgrade";
    } else if (planIdNum === 2) {
      return hasUsedTrialAdvanced ? "Subscribe" : "14 day free trial";
    } else if (planIdNum === 3) {
      return hasUsedTrialLimited ? "Subscribe" : "14 day free trial";
    } else {
      return "Subscribe";
    }
  };

  return (
    <>
      <RegularButton
        handleClick={() => {
          parseInt(pricePlanId) === 1 ? handleClickerFree() : handleClicker();
        }}
        styles={
          userPlanId === parseInt(pricePlanId) || userPlanId === null
            ? " text-sm border-slate-400 text-slate-400"
            : "text-sm border-orange-600 bg-orange-600 text-white"
        }
      >
        {getButtonText(userPlanId)}
      </RegularButton>
      {errorModal && (
        <ModalOverlay onClose={() => setErrorModal(false)}>
          <DowngradeErrorModal checkRes={checkRes} />
        </ModalOverlay>
      )}
    </>
  );
};

const DowngradeErrorModal = ({ checkRes }: { checkRes: CheckType }) => {
  return (
    <div className="p-8 text-center flex flex-col gap-6 items-center bg-white rounded-lg shadow-lg">
      <div className="bg-red-100 p-2 rounded-full flex items-center justify-center h-12 w-12">
        <ExclamationTriangleIcon className="text-red-500 w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-red-500">
        Unable to Downgrade Subscription
      </h2>
      <p className="text-sm text-red-500">
        Some projects exceed the limits allowed by the lower subscription tier.
        Please adjust the following before proceeding:
      </p>

      <section className="bg-red-100 w-full rounded-lg p-3">
        <h3 className="text-red-500">Projects Over Item Limit</h3>
        {checkRes.items.map((project) => (
          <div key={project.id} className="text-sm ">
            <p className="text-red-400">
              {project.name} -{" "}
              <a
                href={`/project/${project.id}`}
                className="text-red-400 hover:text-red-700"
              >
                Edit Items
              </a>
            </p>
          </div>
        ))}
      </section>

      <section className="bg-red-100 w-full rounded-lg p-3">
        <h3 className="text-red-500">Projects Over User Limit</h3>
        {checkRes.users.map((project) => (
          <div key={project.id} className="text-sm ">
            <p className="text-red-400">
              {project.name} -{" "}
              <a
                href={`/project/${project.id}`}
                className="text-red-400 hover:text-red-700"
              >
                Manage Users
              </a>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};
