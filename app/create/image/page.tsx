import ImagePage from "@/app/components/createForm/FormPages/ImagePage";
import { getProjects } from "@/app/lib/projectsDB";
import { Project } from "@/types/receiptTypes";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as Project[];
};

const UploadImage = async () => {
  const projects = await fetchProject();
  return <ImagePage projects={projects} />;
};

export default UploadImage;
