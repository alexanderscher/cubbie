"use client";
import { ProjectType } from "@/types/ProjectTypes";
import React, { useEffect, useState } from "react";
import ReactSelect, { StylesConfig } from "react-select";

interface Option {
  value: string;
  label: string;
  planId: number | null;
  userId: string;
}

interface Props {
  handleChange: (field: string) => (value: any) => void;
  projects: ProjectType[];
  setFieldValue: (field: string, value: any) => void;
  values: any;
  setProjectPlanId: (value: number | null) => void;
}

const ProjectSelectForm = ({
  handleChange,
  projects,
  setFieldValue,
  values,
  setProjectPlanId,
}: Props) => {
  const [options, setOptions] = useState<Option[]>([]);

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

  useEffect(() => {
    if (projects.length > 0) {
      const newOptions = projects.map((project) => {
        const { id, name, user } = project;
        const isSpecialPlan = user.planId !== 1 && user.planId !== null;
        const label = isSpecialPlan ? `${name} *` : name;

        return {
          value: id.toString(),
          label: label,
          planId: user.planId,
          userId: project.userId,
        };
      });
      setOptions(newOptions);

      const initialOption = newOptions.find(
        (option) => option.value === projects[0].id.toString()
      );
      if (initialOption) {
        handleChange("folder")(initialOption.value);

        setFieldValue("folderName", initialOption.label);
        setFieldValue("folderUserId", initialOption.userId);

        setProjectPlanId(initialOption.planId);
      }
    }
  }, [projects, handleChange, setFieldValue, setProjectPlanId]);

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      handleChange("folder")(selectedOption.value);
      setFieldValue("folderName", selectedOption.label);
      setProjectPlanId(selectedOption.planId);
      setFieldValue("folderUserId", selectedOption.userId);
    } else {
      setFieldValue("folderName", "");
    }
  };

  return (
    <div className="w-full">
      <ReactSelect
        options={options}
        onChange={handleSelectChange}
        value={options.find((option) => option.value === values.folder)}
        isClearable={true}
        styles={customStyles}
      />
    </div>
  );
};

export default ProjectSelectForm;
