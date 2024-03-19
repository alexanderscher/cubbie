import ImagePage from "@/app/components/createForm/FormPages/ImagePage";
import ManualPage from "@/app/components/createForm/FormPages/ManualPage";
import { getProjects } from "@/app/lib/projectsDB";
import { Project } from "@/types/receiptTypes";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as Project[];
};

const UploadManual = async () => {
  const projects = await fetchProject();
  return <ManualPage projects={projects} />;
};

export default UploadManual;
