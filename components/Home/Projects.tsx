"use client";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";
import { ProjectOptionsModal } from "@/components/options/ProjectOptions";
import { CreateProject } from "@/components/project/CreateProject";
import { Receipt } from "@/types/AppTypes";
import { Project as ProjectType } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

interface Props {
  serverData: ProjectType[];
}

const Projects = ({ serverData }: Props) => {
  const { isProjectLoading, filteredProjectData, initializeProjects } =
    useSearchProjectContext();
  console.log(serverData);

  useEffect(() => {
    if (serverData) {
      initializeProjects(serverData);
    }
  }, [serverData, initializeProjects]);

  const [openProjectId, setOpenProjectId] = useState(null as number | null);
  const [addProjectOpen, setAddProjectOpen] = useState(false);

  const toggleOpenProject = (
    projectId: number | undefined,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    if (projectId === undefined) return;

    if (openProjectId === projectId) {
      setOpenProjectId(null);
    } else {
      setOpenProjectId(projectId);
    }
  };

  const searchParams = useSearchParams();

  const sortFieldParam = searchParams.get("sort");
  const sortField = sortFieldParam?.startsWith("-")
    ? sortFieldParam.slice(1)
    : sortFieldParam;
  const sortOrder = sortFieldParam?.startsWith("-") ? "desc" : "asc";
  const getTotalPrice = (receipts: Receipt[]) => {
    if (receipts.length === 0) return 0;
    else {
      return receipts.reduce((acc, receipt) => {
        const receiptTotal = receipt.items.reduce(
          (receiptAcc, item) => receiptAcc + item.price,
          0
        );
        return acc + receiptTotal;
      }, 0);
    }
  };

  const filteredData = useMemo(() => {
    const compareProjects = (a: ProjectType, b: ProjectType) => {
      if (sortField === "price" && a.receipts && b.receipts) {
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
    return <div>Loading...</div>;
  }

  if (filteredData.length === 0 && !isProjectLoading) {
    return (
      <NoProjects
        setAddProjectOpen={setAddProjectOpen}
        addProjectOpen={addProjectOpen}
      />
    );
  }
  if (searchParams.get("archive") === "false" || !searchParams.get("archive")) {
    return filteredData.filter(
      (project: ProjectType) => project.archive === false
    ).length === 0 ? (
      <NoProjects
        setAddProjectOpen={setAddProjectOpen}
        addProjectOpen={addProjectOpen}
      />
    ) : (
      <div className="boxes">
        {filteredData
          .filter((project: ProjectType) => project.archive === false)
          .map((project: ProjectType) => (
            <Project
              project={project}
              key={project.id}
              isOpen={openProjectId === project.id}
              onToggleOpen={(e) => toggleOpenProject(project.id, e)}
            />
          ))}
      </div>
    );
  }
  if (searchParams.get("archive") === "true") {
    return filteredData.filter(
      (project: ProjectType) => project.archive === true
    ).length === 0 ? (
      <NoProjects
        setAddProjectOpen={setAddProjectOpen}
        addProjectOpen={addProjectOpen}
      />
    ) : (
      <div className="boxes">
        {filteredData
          .filter((project: ProjectType) => project.archive === true)
          .map((project: ProjectType) => (
            <Project
              project={project}
              key={project.id}
              isOpen={openProjectId === project.id}
              onToggleOpen={(e) => toggleOpenProject(project.id, e)}
            />
          ))}
      </div>
    );
  }
};

export default Projects;

interface ProjectProps {
  project: ProjectType;
  isOpen: boolean;
  onToggleOpen: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Project = ({ project, isOpen, onToggleOpen }: ProjectProps) => {
  return (
    <div className="box xs:pb-6 pb-4 relative" key={project.id}>
      <Link href={`/project/${project.id}`}>
        <div className="w-full  overflow-hidden relative flex justify-center items-center bg-slate-100  rounded-t-lg h-[90px]">
          <div className="w-full h-full flex justify-center items-center ">
            <Image
              src="/folder.png"
              alt=""
              width={40}
              height={40}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div
              onClick={onToggleOpen}
              className="absolute top-0 right-2 cursor-pointer"
            >
              <Image src="/three-dots.png" alt="" width={20} height={20} />
            </div>
          </div>
        </div>

        <div className="p-3 flex flex-col gap-2">
          <h2 className="text-sm text-orange-600">{project.name}</h2>

          <div className="flex gap-1 text-sm">
            <p className=" ">
              {project.receipts?.length}{" "}
              {project.receipts?.length === 1 ? "receipt" : "receipts"} |
            </p>
            <p className=" ">
              {project.receipts?.length === 0 && "$0.00"}
              {project.receipts?.length > 0 &&
                formatCurrency(
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
      </Link>
      {isOpen && <ProjectOptionsModal isOpen={isOpen} project={project} />}
    </div>
  );
};

interface NoProjectsProps {
  setAddProjectOpen: (value: boolean) => void;
  addProjectOpen: boolean;
}

const NoProjects = ({ setAddProjectOpen, addProjectOpen }: NoProjectsProps) => {
  return (
    <div className="boxes">
      <div className="box relative">
        <div className="flex flex-col gap-4 justify-center items-center  p-6">
          <Image
            src="/folder.png"
            alt=""
            width={40}
            height={40}
            className="object-cover "
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <p className="text-lg text-emerald-900">No projects</p>
          <button
            className="border-[1px]  border-emerald-900 py-2 px-10 text-xs text-emerald-900 rounded-full w-full"
            onClick={() => setAddProjectOpen(true)}
          >
            <p className="">Create</p>
          </button>
          {addProjectOpen && (
            <CreateProject setAddProjectOpen={setAddProjectOpen} />
          )}
        </div>
      </div>
    </div>
  );
};
