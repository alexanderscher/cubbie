"use client";
import { Project } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  console.log(projects);

  useEffect(() => {
    const getProjects = async () => {
      const response = await fetch("/api/project");
      const data = await response.json();
      setProjects(data);
    };
    getProjects();
  }, []);
  return (
    <div className="boxes">
      {projects.map((project) => (
        <div className="box xs:pb-6 pb-4" key={project.id}>
          <div className="w-full  overflow-hidden relative flex justify-center items-center bg-slate-100 rounded-t-lg h-[90px]">
            <div className="w-full h-full flex justify-center items-center ">
              <Image
                src="/folder.png"
                alt=""
                width={40}
                height={40}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>
          <div className="p-2 flex flex-col gap-2">
            <h2 className="text-sm text-orange-600">{project.name}</h2>

            <div className="flex gap-1 text-sm">
              <p className=" ">
                {project.receipts.length}{" "}
                {project.receipts.length === 1 ? "receipt" : "receipts"} |
              </p>
              <p className=" ">
                {formatCurrency(
                  project.receipts.reduce((acc, receipt) => {
                    const receiptTotal = receipt.items.reduce(
                      (receiptAcc, item) => receiptAcc + item.price,
                      0
                    );
                    return acc + receiptTotal;
                  }, 0)
                )}
              </p>
            </div>

            <p className="text-sm">
              Created on {formatDateToMMDDYY(project.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects;
