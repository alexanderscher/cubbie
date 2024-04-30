import { auth } from "@/auth";
import Account from "@/components/profile/Account";
import Header from "@/components/profile/Header";
import { Project, Session } from "@/types/AppTypes";
import React from "react";
import styles from "@/components/profile/profile.module.css";
import { getProjects } from "@/lib/projectsDB";

const fetchProject = async () => {
  const projects = await getProjects();
  return projects as Project[];
};
export default async function Profile() {
  const session = (await auth()) as Session;
  const projects = await fetchProject();

  return (
    <div
      className={`${styles.layout} gap-6 w-full justify-center items center`}
    >
      <Header />
      <Account session={session} projects={projects} />
    </div>
  );
}
