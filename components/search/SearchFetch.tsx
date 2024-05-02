import SearchAllItems from "@/components/search/SearchAlltems";
import { getProjects } from "@/lib/projectsDB";
import { getReceipts } from "@/lib/receiptsDB";
import { ProjectType } from "@/types/ProjectTypes";
import { ReceiptType } from "@/types/ReceiptTypes";

import React from "react";

const fetchProjects = async () => {
  const projects = await getProjects();
  return projects as ProjectType[];
};

const receipt = async () => {
  const receipts = await getReceipts();
  return receipts as ReceiptType[];
};

export default async function SearchFetch() {
  const projectData = await fetchProjects();
  const receiptData = await receipt();
  return <SearchAllItems projectData={projectData} receiptData={receiptData} />;
}
