"use client";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";
import PageLoading from "@/components/Loading/PageLoading";
import { ProjectOptionsModal } from "@/components/options/ProjectOptions";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { Overlay } from "@/components/overlays/Overlay";
import { CreateProject } from "@/components/project/CreateProject";
import { TruncateText } from "@/components/text/Truncate";
import { getProjectsClient } from "@/lib/getProjectsClient";
import { ProjectType, ProjectUserArchiveType } from "@/types/ProjectTypes";
import { ReceiptType } from "@/types/ReceiptTypes";
import { Session } from "@/types/Session";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const fetchProject = async () => {
  const projects = await getProjectsClient();
  return projects as ProjectType[];
};
interface Props {
  session: Session;
}

const Projects = ({ session }: Props) => {
  const { isProjectLoading, filteredProjectData, initializeProjects } =
    useSearchProjectContext();

  useEffect(() => {
    fetchProject().then((data) => {
      initializeProjects(data);
    });
  }, [, initializeProjects]);

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
  const getTotalPrice = (receipts: ReceiptType[]) => {
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
        const totalPriceA = getTotalPrice(a.receipts as ReceiptType[]);
        const totalPriceB = getTotalPrice(b.receipts as ReceiptType[]);
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
    return <PageLoading loading={isProjectLoading} />;
  }

  if (filteredData.length === 0 && !isProjectLoading) {
    return (
      <NoProjects
        setAddProjectOpen={setAddProjectOpen}
        addProjectOpen={addProjectOpen}
      />
    );
  }
  const currentProjects = filteredData
    .filter((project) => {
      return !(
        project.projectUserArchive?.some(
          (entry: ProjectUserArchiveType) =>
            entry.userId === session.user.id.toString()
        ) || false
      );
    })
    .map((project) => {
      return (
        <Project
          session={session}
          archived={false}
          project={project}
          key={project.id}
          isOpen={openProjectId === project.id}
          onToggleOpen={(e) => toggleOpenProject(project.id, e)}
          setOpenProjectId={setOpenProjectId}
        />
      );
    });
  const archiveProjects = filteredData
    .filter((project) => {
      return (
        project.projectUserArchive?.some(
          (entry: ProjectUserArchiveType) =>
            entry.userId === session.user.id.toString()
        ) || false
      );
    })
    .map((project) => {
      return (
        <Project
          session={session}
          archived={true}
          project={project}
          key={project.id}
          isOpen={openProjectId === project.id}
          setOpenProjectId={setOpenProjectId}
          onToggleOpen={(e) => toggleOpenProject(project.id, e)}
        />
      );
    });

  if (searchParams.get("archive") === "false" || !searchParams.get("archive")) {
    return (
      <>
        {currentProjects.length > 0 ? (
          <div className="boxes">{currentProjects}</div>
        ) : (
          <NoProjects
            setAddProjectOpen={setAddProjectOpen}
            addProjectOpen={addProjectOpen}
          />
        )}
      </>
    );
  }
  if (searchParams.get("archive") === "true") {
    return (
      <>
        {archiveProjects.length > 0 ? (
          <div className="boxes">{archiveProjects}</div>
        ) : (
          <NoProjects
            setAddProjectOpen={setAddProjectOpen}
            addProjectOpen={addProjectOpen}
          />
        )}
      </>
    );
  }
};

export default Projects;

interface ProjectProps {
  project: ProjectType;
  isOpen: boolean;
  onToggleOpen: (event: React.MouseEvent<HTMLDivElement>) => void;
  archived: boolean;
  session: Session;
  setOpenProjectId: (value: number | null) => void;
}

const Project = ({
  project,
  isOpen,
  onToggleOpen,
  archived,
  session,
  setOpenProjectId,
}: ProjectProps) => {
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
          <TruncateText
            text={project.name}
            styles={"text-orange-600 text-sm"}
            type="not"
          />

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
          {session.user.email !== project.user.email && (
            <p className="text-sm">{project.user.email}</p>
          )}
        </div>
      </Link>
      {isOpen && (
        <>
          <Overlay onClose={() => setOpenProjectId(null)} />
          <ProjectOptionsModal
            isOpen={isOpen}
            project={project}
            archived={archived}
            session={session}
          />
        </>
      )}
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
            <ModalOverlay onClose={() => setAddProjectOpen(false)}>
              <CreateProject setAddProjectOpen={setAddProjectOpen} />
            </ModalOverlay>
          )}
        </div>
      </div>
    </div>
  );
};
