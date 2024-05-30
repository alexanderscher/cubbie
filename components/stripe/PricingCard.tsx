"use client";
import ReactSelect, { StylesConfig } from "react-select";
import { useSession } from "next-auth/react";
import { ProjectType, ProjectUserArchiveType } from "@/types/ProjectTypes";
import { FormError } from "@/components/form-error";
import React, { useState, useTransition } from "react";
import RegularButton from "@/components/buttons/RegularButton";
import { freePlan, handlePayment } from "@/actions/stripe/payment";
import Loading from "@/components/Loading/Loading";
import ErrorModal from "@/components/error/ErrorModal";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { useRouter } from "next/navigation";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface priceProps {
  price: any;
  session: any;
}

const PricingCard = ({ price, session }: priceProps) => {
  console.log(session.user);
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
      {price.product.name === "Advanced Project Plan" && <AllProjectPlan />}
      {price.product.name === "Limited Project Plan" && <LimitedProjectPlan />}

      <SubButton
        userPlanId={session.user.planId}
        pricePlanId={price.product.metadata.planId}
        handleSubscription={handleSubscription}
        setCancelPrompt={setCancelPrompt}
      />

      {isPending && <Loading loading={isPending} />}
      {error && <FormError message={error}></FormError>}
      {errorModal && (
        <ErrorModal
          errorMessage="You are currently subscribed to the All Project Plan. Please switch to the Free Plan before subscribing to a different plan."
          onClose={() => setErrorModal(false)}
        />
      )}
      {cancelPrompt && (
        <ModalOverlay onClose={() => setCancelPrompt(false)}>
          <div className="bg-white p-20 rounded-xl shadow max-w-lg mx-auto text-center">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="bg-orange-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
                <ExclamationTriangleIcon className=" text-orange-400 w-3/4 h-1/2" />
              </div>
              <h1 className="text-orange-400">
                {" "}
                Are you sure you want to downgrade to the free plan?
              </h1>
              <h1>{session.subscription}</h1>

              <RegularButton
                handleClick={() => handleSubscription()}
                styles={
                  "text-sm border-orange-400 bg-orange-400 text-white w-full"
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
      <p>Start with ten free AI features for all projects</p>
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
}: {
  userPlanId: number;
  pricePlanId: string;
  handleSubscription: () => void;
  setCancelPrompt?: (value: boolean) => void;
}) => {
  console.log(userPlanId, pricePlanId);
  if (parseInt(pricePlanId) === 1 && setCancelPrompt) {
    return (
      <RegularButton
        handleClick={() => {
          if (userPlanId !== parseInt(pricePlanId)) {
            setCancelPrompt(true);
          }
        }}
        styles={
          userPlanId !== parseInt(pricePlanId)
            ? "text-sm border-orange-400 bg-orange-400 text-white"
            : "text-sm border-slate-400 text-slate-400"
        }
      >
        {userPlanId !== parseInt(pricePlanId) ? "Downgrade" : "Current Plan"}
      </RegularButton>
    );
  } else {
    return (
      <RegularButton
        handleClick={() => {
          if (userPlanId !== parseInt(pricePlanId)) {
            handleSubscription();
          }
        }}
        styles={
          userPlanId !== parseInt(pricePlanId)
            ? "text-sm border-orange-400 bg-orange-400 text-white"
            : "text-sm border-slate-400 text-slate-400"
        }
      >
        {userPlanId !== parseInt(pricePlanId) ? "Subscribe" : "Current Plan"}
      </RegularButton>
    );
  }
};

interface Option {
  value: string;
  label: string;
}

interface Props {
  projects: ProjectType[];
  setSelectedProject: (value: string) => void;
  selectedProject: string;
}

export const ProjectSelect = ({
  projects,
  setSelectedProject,
  selectedProject,
}: Props) => {
  const session = useSession();

  const customGreenStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#FFFFFF",
      borderColor: "rgb(6 78 59)",
      borderWidth: "1px",
      boxShadow: state.isFocused ? "0 0 0px .08px rgb(6 78 59)" : "none",
      "&:hover": {
        borderColor: "rgb(6 78 59)",
      },
      cursor: "pointer",
      padding: "3px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#FFFFFF",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#F1F5F9" : "#FFFFFF",
      color: "#000",
      "&:active": {
        backgroundColor: "#F1F5F9",
      },
      cursor: "pointer",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a0aec0",
      fontSize: "14px",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };
  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#FFFFFF",
      borderColor: "rgb(148 163 184)",
      borderWidth: "1px",
      boxShadow: state.isFocused ? "0 0 0px .08px rgb(6 78 59)" : "none",
      "&:hover": {
        borderColor: "rgb(6 78 59)",
      },
      cursor: "pointer",
      padding: "3px ",
      fontSize: "14spx",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#FFFFFF",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#F1F5F9" : "#FFFFFF",
      color: "#000",
      "&:active": {
        backgroundColor: "#F1F5F9",
      },
      cursor: "pointer",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#a0aec0",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      setSelectedProject(selectedOption.value);
    }
  };

  const projectOptions: Option[] = projects.map((project) => ({
    value: project.id.toString(),
    label: project.name,
  }));

  return (
    <div className="w-full ">
      <ReactSelect
        options={projectOptions.filter((option) => {
          const project = projects.find(
            (project) => project.id.toString() === option.value
          );

          return (
            project &&
            !project.projectUserArchive?.some(
              (entry: ProjectUserArchiveType) =>
                entry.userId === session.data?.user.id
            )
          );
        })}
        onChange={handleSelectChange}
        value={projectOptions.find(
          (option) => option.value === selectedProject
        )}
        isClearable={true}
        placeholder="Select a project to subscribe to"
        styles={customStyles}
      />
    </div>
  );
};
