"use client";
import { useSearchProjectContext } from "@/app/components/context/SearchProjectContext";
import { Project as ProjectType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import { Receipt } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Projects = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { isProjectLoading, filteredProjectData } = useSearchProjectContext();

  if (isProjectLoading) {
    return (
      <div className="">
        <p>Loading...</p>
      </div>
    );
  }

  if (
    filteredProjectData.length === 0 &&
    receipts.length === 0 &&
    !isProjectLoading
  ) {
    return (
      <div className="">
        <p>No projects found</p>
      </div>
    );
  }
  return (
    <div className="boxes">
      {filteredProjectData.map((project) => (
        <div className="box xs:pb-6 pb-4 relative" key={project.id}>
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
              <Image
                src="/three-dots.png"
                className="absolute top-0 right-2 cursor-pointer "
                alt=""
                width={20}
                height={20}
                onClick={() => setIsOpen(!isOpen)}
              />
            </div>
          </div>
          {isOpen && <OptionsModal isOpen={isOpen} project={project} />}
          <div className="p-3 flex flex-col gap-2">
            <Link href={`/project/${project.id}`}>
              <h2 className="text-sm text-orange-600">{project.name}</h2>
            </Link>

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

interface OptionsModalProps {
  isOpen: boolean;

  project: ProjectType;
}

const OptionsModal = ({ isOpen, project }: OptionsModalProps) => {
  return (
    <div className="absolute bg-white shadow-1 -right-2 top-6 rounded-md  w-[200px]">
      <div className="p-4 rounded-lg text-sm flex flex-col gap-2">
        <div className="bg-slate-100 rounded-md w-full p-2">
          <div className="flex gap-2">
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete</p>
          </div>
        </div>
        <div className="bg-slate-100 rounded-md w-full p-2">
          <div className="flex gap-2">
            <Image src={"/add.png"} width={20} height={20} alt=""></Image>
            <p>Add receipt</p>
          </div>
        </div>
      </div>
    </div>
  );
};
