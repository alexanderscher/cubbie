import React from "react";
import ReactSelect, { StylesConfig } from "react-select";
import { useSession } from "next-auth/react";
import { ProjectUserArchiveType } from "@/types/ProjectTypes";
import { ReceiptProjectType } from "@/types/ReceiptTypes";

interface Option {
  value: string;
  label: string;
}

interface Props {
  handleChange: (value: any) => void;
  projects: ReceiptProjectType[];
  values: any;
  errors: any;
  color?: string;
}

export const ProjectSelect = ({
  handleChange,
  projects,
  values,
  errors,
  color,
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
      handleChange(selectedOption.value);
    }
  };

  const projectOptions: Option[] = projects.map((project) => ({
    value: project.id.toString(),
    label: project.name,
  }));

  return (
    <div className="w-full ">
      <p
        className={`${
          color === "green" ? "text-emerald-900" : " text-slate- 400"
        } text-xl`}
      >
        Project Folder
      </p>
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
        value={projectOptions.find((option) => option.value === values)}
        isClearable={true}
        placeholder="Change project folder"
        styles={color === "green" ? customGreenStyles : customStyles}
      />
      {errors.folderName && (
        <p className="text-orange-800 text-sm">{errors.folderName}</p>
      )}
    </div>
  );
};

export default ProjectSelect;
