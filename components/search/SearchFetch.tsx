import SearchAllItems from "@/components/search/AlItems";
import { getProjects } from "@/lib/projectsDB";
import { getReceipts } from "@/lib/receiptsDB";
import { Project, Receipt } from "@/types/AppTypes";

import React from "react";

const fetchProjects = async () => {
  const projects = await getProjects();
  return projects as Project[];
};

const receipt = async () => {
  const receipts = await getReceipts();
  return receipts as Receipt[];
};

export default async function SearchFetch() {
  const projectData = await fetchProjects();
  const receiptData = await receipt();
  return <SearchAllItems projectData={projectData} receiptData={receiptData} />;
}
