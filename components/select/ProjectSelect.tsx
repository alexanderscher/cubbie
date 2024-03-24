import React from "react";
import ReactSelect, { StylesConfig } from "react-select";
import { Project } from "@/types/receiptTypes";

interface Option {
  value: string;
  label: string;
}

interface Props {
  handleChange: (value: any) => void;
  projects: Project[];
  values: any;
  errors: any;
}

const ProjectSelect = ({ handleChange, projects, values, errors }: Props) => {
  console.log("values", projects);
  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#e2f1e2",
      borderColor: "rgb(148 163 184)",
      borderWidth: "1px",
      boxShadow: state.isFocused ? "0 0 0px .08px rgb(6 78 59)" : "none",
      "&:hover": {
        borderColor: "rgb(6 78 59)",
      },
      cursor: "pointer",
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

  const options: Option[] = projects.map((project) => ({
    value: project.id.toString(),
    label: project.name,
  }));

  const handleSelectChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      handleChange(selectedOption.value);
    }
  };

  return (
    <div className="w-full ">
      <p className="text-slate-400">Project folder</p>
      <ReactSelect
        options={options}
        onChange={handleSelectChange}
        value={options.find((option) => option.value === values)}
        isClearable={true}
        placeholder="Change project folder"
        styles={customStyles}
      />
      {errors.folderName && (
        <p className="text-orange-800 text-sm">{errors.folderName}</p>
      )}
    </div>
  );
};

export default ProjectSelect;
