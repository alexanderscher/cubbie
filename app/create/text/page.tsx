import FormHeader from "@/components/createForm/FormPages/FormHeader";
import TextPage from "@/components/createForm/FormPages/TextPage";
import { getProjects } from "@/lib/projectsDB";
import { ProjectType } from "@/types/ProjectTypes";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as ProjectType[];
};

const UploadText = async () => {
  const projects = await fetchProject();
  return (
    <FormHeader>
      <TextPage projects={projects} />
    </FormHeader>
  );
};

export default UploadText;
