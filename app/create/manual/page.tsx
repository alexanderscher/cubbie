import FormHeader from "@/components/createForm/FormPages/FormHeader";
import ImagePage from "@/components/createForm/FormPages/ImagePage";
import ManualPage from "@/components/createForm/FormPages/ManualPage";
import { getProjects } from "@/lib/projectsDB";
import { Project } from "@/types/receiptTypes";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as Project[];
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
