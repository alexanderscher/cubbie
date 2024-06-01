import { auth } from "@/auth";
import FormHeader from "@/components/createForm/FormPages/FormHeader";
import ImagePage from "@/components/createForm/FormPages/ImagePage";
import { getProjects } from "@/lib/projectsDB";
import { ProjectType } from "@/types/ProjectTypes";
import { Session } from "@/types/Session";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as ProjectType[];
};

const UploadImage = async () => {
  const projects = await fetchProject();
  const session = (await auth()) as Session;
  return (
    <FormHeader>
      <ImagePage projects={projects} session={session} />
    </FormHeader>
  );
};

export default UploadImage;
