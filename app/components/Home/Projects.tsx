"use client";
import { useSearchProjectContext } from "@/app/components/context/SearchProjectContext";
import { EditProject } from "@/app/components/project/EditProject";
import { Receipt, Project as ProjectType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

const Projects = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const { isProjectLoading, filteredProjectData } = useSearchProjectContext();

  const searchParams = useSearchParams();

  const sortFieldParam = searchParams.get("sort");
  const sortField = sortFieldParam?.startsWith("-")
    ? sortFieldParam.slice(1)
    : sortFieldParam;
  const sortOrder = sortFieldParam?.startsWith("-") ? "desc" : "asc";
  const getTotalPrice = (receipts: Receipt[]) => {
    return receipts.reduce((acc, receipt) => {
      const receiptTotal = receipt.items.reduce(
        (receiptAcc, item) => receiptAcc + item.price,
        0
      );
      return acc + receiptTotal;
    }, 0);
  };

  const filteredData = useMemo(() => {
    const compareProjects = (a: ProjectType, b: ProjectType) => {
      if (sortField === "price") {
        const totalPriceA = getTotalPrice(a.receipts);
        const totalPriceB = getTotalPrice(b.receipts);
        return sortOrder === "asc"
          ? totalPriceB - totalPriceA
          : totalPriceA - totalPriceB;
      } else {
        const keyA = sortField as keyof ProjectType;
        const keyB = sortField as keyof ProjectType;
        const dateA = new Date(a[keyA] as Date).getTime();
        const dateB = new Date(b[keyB] as Date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    };
    return filteredProjectData.sort(compareProjects);
  }, [filteredProjectData, sortField, sortOrder]);

  if (isProjectLoading) {
    return (
      <div className="">
        <p>Loading...</p>
      </div>
    );
  }

  if (filteredData.length === 0 && receipts.length === 0 && !isProjectLoading) {
    return (
      <div className="">
        <p>No projects found</p>
      </div>
    );
  }
  return (
    <div className="boxes">
      {filteredData.map((project) => (
        <Project project={project} key={project.id} />
      ))}
    </div>
  );
};

export default Projects;

const Project = ({ project }: { project: ProjectType }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
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
  );
};

interface OptionsModalProps {
  isOpen: boolean;

  project: ProjectType;
}

const OptionsModal = ({ project }: OptionsModalProps) => {
  const { setProjectRefresh } = useSearchProjectContext();
  const [edit, setEdit] = useState(false);
  return (
    <div className="absolute bg-white shadow-1 -right-2 top-6 rounded-md  w-[200px]">
      <div className="p-4 rounded-lg text-sm flex flex-col gap-2">
        <div className="bg-slate-100 rounded-md w-full p-2">
          <Link href={`/receipt-type`}>
            <div className="flex gap-2">
              <Image src={"/add.png"} width={20} height={20} alt=""></Image>
              <p>Add receipt</p>
            </div>
          </Link>
        </div>
        <div
          className="bg-slate-100 rounded-md w-full p-2"
          onClick={() => setEdit(true)}
        >
          <div className="flex gap-2">
            <Image src={"/edit.png"} width={20} height={20} alt=""></Image>
            <p>Edit</p>
          </div>
        </div>
        <div className="bg-slate-100 rounded-md w-full p-2">
          <div className="flex gap-2">
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete</p>
          </div>
        </div>
      </div>
      {edit && (
        <EditProject
          setEdit={setEdit}
          project={project}
          setRefresh={setProjectRefresh}
        />
      )}
    </div>
  );
};
