"use client";
import ReactSelect, { StylesConfig } from "react-select";
import { useSession } from "next-auth/react";
import { ProjectType, ProjectUserArchiveType } from "@/types/ProjectTypes";
import { FormError } from "@/components/form-error";
import React, { useState, useTransition } from "react";
import RegularButton from "@/components/buttons/RegularButton";
import {
  handlePayment,
  handlePaymentIndividual,
} from "@/actions/stripe/payment";
import Loading from "@/components/Loading/Loading";
import { Subscription } from "@prisma/client";

interface priceProps {
  price: any;
  session: any;
  projects: ProjectType[];
}

const PricingCard = ({ price, session, projects }: priceProps) => {
  const [selectedProject, setSelectedProject] = useState("");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubscription = async () => {
    startTransition(async () => {
      try {
        if (parseInt(price.product.metadata.planId) === 3) {
          if (selectedProject === "") {
            setError("Please select a project");
            return;
          }
          setError("");
          const stripeUrl = await handlePaymentIndividual(
            price.id,
            selectedProject,
            price.product.metadata.planId
          );
          if (stripeUrl) {
            window.location.assign(stripeUrl);
          } else {
            throw new Error("Failed to create payment session");
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

  if (
    price.product.name === "Individual Project Plan" &&
    session.user.planId === 2
  ) {
    return <div></div>;
  } else
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
        {price.product.name === "All Project Plan" && <AllProjectPlan />}
        {price.product.name === "Individual Project Plan" && (
          <IndividualPlan
            projects={projects}
            setSelectedProject={setSelectedProject}
            selectedProject={selectedProject}
          />
        )}
        <SubButton
          userPlanId={session.user.planId}
          pricePlanId={price.product.metadata.planId}
          handleSubscription={handleSubscription}
        />

        {isPending && <Loading loading={isPending} />}
        {error && <FormError message={error}></FormError>}
      </div>
    );
};

export default PricingCard;

const FreePlan = () => {
  return (
    <div className="text-slate-400 text-sm">
      <p>Free</p>
      <p>Up to 50 receipt items</p>
      <p>Barcode look up</p>
    </div>
  );
};

const AllProjectPlan = () => {
  return (
    <div className="text-slate-400 text-sm">
      <p>Ulimited items</p>
      <p>Barcode look up</p>
      <p>AI features for all projects </p>
      <p>Receipt return alerts</p>
    </div>
  );
};

const IndividualPlan = ({
  setSelectedProject,
  selectedProject,
  projects,
}: {
  setSelectedProject: (value: string) => void;
  selectedProject: string;
  projects: ProjectType[];
}) => {
  return (
    <div className="text-slate-400 text-sm">
      <p>Up to 200 items</p>
      <p>Barcode look up</p>
      <p>AI features for subscribed project</p>
      <p>Receipt return alerts for subscribed project</p>
      <div className="mt-4 mb-4">
        <ProjectSelect
          projects={projects}
          setSelectedProject={setSelectedProject}
          selectedProject={selectedProject}
        />
      </div>
    </div>
  );
};

const SubButton = ({
  userPlanId,
  pricePlanId,
  handleSubscription,
}: {
  userPlanId: number;
  pricePlanId: string;
  handleSubscription: (pricePlanId: string) => void;
}) => {
  if (userPlanId === 3) {
    return (
      <RegularButton
        handleClick={() => handleSubscription(pricePlanId)}
        styles={"text-sm border-orange-400 bg-orange-400 text-white"}
      >
        {"Subscribe"}
      </RegularButton>
    );
  } else {
    return (
      <RegularButton
        handleClick={() => handleSubscription(pricePlanId)}
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
            !project.subscription &&
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
