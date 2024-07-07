import FormHeader from "@/components/createForm/FormPages/FormHeader";
import ManualPage from "@/components/createForm/FormPages/ManualPage";
import { getProjects } from "@/lib/projectsDB";
import { ProjectType } from "@/types/ProjectTypes";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as ProjectType[];
};

const UploadManual = async () => {
  const projects = await fetchProject();
  return (
    <FormHeader>
      <ManualPage projects={projects} />
    </FormHeader>
  );
};

export default UploadManual;
