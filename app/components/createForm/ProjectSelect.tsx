import { Project } from "@/types/receipt";
import React from "react";

interface Props {
  handleChange: (field: string) => (e: React.ChangeEvent<any>) => void;
  projects: Project[];
  setFieldValue: (field: string, value: any) => void;
  values: any;
  errors: any;
}

const ProjectSelect = ({
  handleChange,
  projects,
  setFieldValue,
  values,
  errors,
}: Props) => {
  return (
    <div className="w-full">
      <p className="text-sm text-slate-400 ">Project folder*</p>
      <select
        className="w-full border-[1px] bg  p-2 rounded-md border-slate-400 focus:border-emerald-900 focus:outline-none"
        onChange={(e) => {
          const value = e.target.value;
          handleChange("folder")(e);

          const selectedProject = projects.find(
            (project) => project.id === +value
          );

          const folderName = selectedProject ? selectedProject.name : "";

          setFieldValue("folderName", folderName);
        }}
      >
        <option value="">
          {values.folderName ? values.folderName : "Choose project folder"}
        </option>
        {projects.length > 0 &&
          projects
            .filter((project) => project.name !== values.folderName) // Exclude the project with name equal to values.folderName
            .map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
      </select>
      {errors.folderName && (
        <p className="text-orange-800 text-sm">{errors.folderName}</p>
      )}
    </div>
  );
};

export default ProjectSelect;
