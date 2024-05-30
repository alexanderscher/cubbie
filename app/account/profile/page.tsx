import { auth } from "@/auth";
import Account from "@/components/profile/Account";
import Header from "@/components/profile/Header";
import { Session } from "@/types/Session";
import React from "react";
import styles from "@/components/profile/profile.module.css";
import { getProjects } from "@/lib/projectsDB";
import { ProjectType } from "@/types/ProjectTypes";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as ProjectType[];
};
export default async function Profile() {
  const session = (await auth()) as Session;
  const projects = await fetchProject();

  return (
    <div className={`${styles.layout} gap-6 w-full justify-start `}>
      <Header />

      <div className="flex justify-center w-full">
        <Account session={session} projects={projects} />
      </div>
    </div>
  );
}
