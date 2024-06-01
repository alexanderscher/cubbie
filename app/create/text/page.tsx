import { auth } from "@/auth";
import FormHeader from "@/components/createForm/FormPages/FormHeader";
import TextPage from "@/components/createForm/FormPages/TextPage";
import { getProjects } from "@/lib/projectsDB";
import { ProjectType } from "@/types/ProjectTypes";
import { Session } from "@/types/Session";
import React from "react";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as ProjectType[];
};

const UploadText = async () => {
  const projects = await fetchProject();
  const session = (await auth()) as Session;

  return (
    <FormHeader>
      <TextPage projects={projects} session={session} />
    </FormHeader>
  );
};

export default UploadText;
