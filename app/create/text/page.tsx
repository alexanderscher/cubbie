import ImagePage from "@/app/components/createForm/FormPages/ImagePage";
import TextPage from "@/app/components/createForm/FormPages/TextPage";
import { getProjects } from "@/app/lib/projectsDB";
import { Project } from "@/types/receiptTypes";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as Project[];
};

const UploadText = async () => {
  const projects = await fetchProject();
  return <TextPage projects={projects} />;
};

export default UploadText;
