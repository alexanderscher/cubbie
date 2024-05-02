import FormHeader from "@/components/createForm/FormPages/FormHeader";
import ImagePage from "@/components/createForm/FormPages/ImagePage";
import { getProjects } from "@/lib/projectsDB";
import { ProjectType } from "@/types/ProjectTypes";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as ProjectType[];
};

const UploadImage = async () => {
  const projects = await fetchProject();
  return (
    <FormHeader>
      <ImagePage projects={projects} />
    </FormHeader>
  );
};

export default UploadImage;
