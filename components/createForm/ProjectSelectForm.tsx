"use client";
import { ProjectType } from "@/types/ProjectTypes";
import React, { useEffect } from "react";
import ReactSelect, { StylesConfig } from "react-select";

interface Option {
  value: string;
  label: string;
  planId: number | null;
}

interface Props {
  handleChange: (field: string) => (value: any) => void;
  projects: ProjectType[];
  setFieldValue: (field: string, value: any) => void;
  values: any;
  setProjectPlanId: (value: number | null) => void;
  // errors: any;
}

const ProjectSelectForm = ({
  handleChange,
  projects,
  setFieldValue,
  values,
  setProjectPlanId,
}: Props) => {
  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#e2f1e2",
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
      backgroundColor: "#e2f1e2",
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
  };

  const options = projects.map((project) => {
    const { id, name, user } = project;
    // Check if planId is not '1' or null
    const isSpecialPlan = user.planId !== 1 && user.planId !== null;
    // Append '*' to label if conditions are met
    const label = isSpecialPlan ? `${name} *` : name;

    return {
      value: id.toString(),
      label: label,
      planId: user.planId, // assuming this is needed elsewhere, though it's not used directly in ReactSelect
    };
  });

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      console.log(selectedOption);
      handleChange("folder")(selectedOption.value);
      setFieldValue("folderName", selectedOption.label);
      setProjectPlanId(selectedOption.planId);
    } else {
      setFieldValue("folderName", "");
    }
  };

  useEffect(() => {
    if (projects.length > 0) {
      const initialProject = projects[0];
      const initialOption = {
        value: initialProject.id.toString(),
        label: initialProject.name,
        planId: initialProject.user.planId,
      };

      handleChange("folder")(initialOption.value);
      setFieldValue("folderName", initialOption.label);
      setProjectPlanId(initialOption.planId);
    } else {
      setFieldValue("folderName", "");
    }
  }, [projects, handleChange, setFieldValue, setProjectPlanId]);

  return (
    <div className="w-full">
      <p className="text-emerald-900 text-sm">Project folder*</p>
      <ReactSelect
        options={options}
        onChange={handleSelectChange}
        value={options.find((option) => option.label === values.folderName)}
        isClearable={true}
        styles={customStyles}
      />
      {/* {errors.folderName && (
        <p className="text-orange-800 text-sm">{errors.folderName}</p>
      )} */}
    </div>
  );
};

export default ProjectSelectForm;
