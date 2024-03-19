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
  return (
    <div>
      <div className="border-b-[1px] border-emerald-900">
        <h1 className="text-emerald-900 text-2xl">Create Receipt</h1>
      </div>
      <ImagePage projects={projects} />
    </div>
  );
};

export default UploadImage;
