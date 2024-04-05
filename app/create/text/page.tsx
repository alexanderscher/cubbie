import FormHeader from "@/components/createForm/FormPages/FormHeader";
import TextPage from "@/components/createForm/FormPages/TextPage";
import { getProjects } from "@/lib/projectsDB";
import { Project } from "@/types/AppTypes";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as Project[];
};

const UploadText = async () => {
  const projects = await fetchProject();
  console.log(projects);
  return (
    <FormHeader>
      <TextPage projects={projects} />
    </FormHeader>
  );
};

export default UploadText;
