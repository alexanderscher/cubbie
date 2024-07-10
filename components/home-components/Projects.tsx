"use client";
import {
  archiveAll,
  archiveProjects,
  checkProject,
  deleteAll,
  deleteProjects,
} from "@/actions/select/selectedProjects";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";
import { SelectedBar } from "@/components/home-components/SelectedBar";
import Loading from "@/components/loading-components/Loading";
import PageLoading from "@/components/loading-components/PageLoading";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { ProjectOptionsModal } from "@/components/options/ProjectOptions";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { Overlay } from "@/components/overlays/Overlay";
import { CreateProject } from "@/components/project/CreateProject";
import { TruncateText } from "@/components/text/Truncate";
import TailwindCheckbox from "@/components/ui/TailwindCheckbox";
import { ProjectType, ProjectUserArchiveType } from "@/types/ProjectTypes";
import { ReceiptType } from "@/types/ReceiptTypes";
import { CheckedProjects } from "@/types/SelectType";
import { Session } from "@/types/Session";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

interface Props {
  session: Session;
}

const Projects = ({ session }: Props) => {
  const { isProjectLoading, filteredProjectData, selectProjectTrigger } =
    useSearchProjectContext();

  const [openProjectId, setOpenProjectId] = useState(null as number | null);
  const [addProjectOpen, setAddProjectOpen] = useState(false);

  const [checkedProjects, setCheckedProjects] = useState<CheckedProjects[]>([]);
  const [isSelectedOpen, setIsSelectedOpen] = useState(false);

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
          setCheckedProjects={setCheckedProjects}
          session={session}
          archived={false}
          project={project}
          key={project.id}
          isOpen={openProjectId === project.id}
          onToggleOpen={(e) => toggleOpenProject(project.id, e)}
          setOpenProjectId={setOpenProjectId}
          checkedProjects={checkedProjects}
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
          setCheckedProjects={setCheckedProjects}
          checkedProjects={checkedProjects}
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
      <div className="flex flex-col gap-6">
        <SelectedBar
          selectTrigger={selectProjectTrigger}
          checkedItems={checkedProjects}
          setIsSelectedOpen={setIsSelectedOpen}
          isSelectedOpen={isSelectedOpen}
        >
          <SelectedProjectOptions
            checkedProjects={checkedProjects}
            setCheckedProjects={setCheckedProjects}
          />
        </SelectedBar>

        {currentProjects.length > 0 ? (
          <div className="boxes">{currentProjects}</div>
        ) : (
          <NoProjects
            setAddProjectOpen={setAddProjectOpen}
            addProjectOpen={addProjectOpen}
          />
        )}
      </div>
    );
  }
  if (searchParams.get("archive") === "true") {
    return (
      <div className="flex flex-col gap-6">
        <SelectedBar
          selectTrigger={selectProjectTrigger}
          checkedItems={checkedProjects}
          setIsSelectedOpen={setIsSelectedOpen}
          isSelectedOpen={isSelectedOpen}
        >
          <SelectedProjectOptions
            checkedProjects={checkedProjects}
            setCheckedProjects={setCheckedProjects}
            archive={true}
          />
        </SelectedBar>

        {archiveProjects.length > 0 ? (
          <div className="boxes">{archiveProjects}</div>
        ) : (
          <NoProjects
            setAddProjectOpen={setAddProjectOpen}
            addProjectOpen={addProjectOpen}
          />
        )}
      </div>
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
  setCheckedProjects: (value: any) => void;
  checkedProjects?: any;
}

const Project = ({
  project,
  isOpen,
  onToggleOpen,
  archived,
  session,
  setOpenProjectId,
  setCheckedProjects,
  checkedProjects,
}: ProjectProps) => {
  const { selectProjectTrigger } = useSearchProjectContext();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const projectId = project.id;

    setCheckedProjects((prev: CheckedProjects[]) =>
      event.target.checked
        ? [...prev, { project_id: projectId, checked: true }]
        : prev.filter((entry) => entry.project_id !== projectId)
    );
  };
  return (
    <div className="box xs:pb-6 pb-4 relative" key={project.id}>
      <div className="w-full  overflow-hidden relative flex justify-center items-center bg-slate-100  rounded-t-lg h-[90px]">
        <div className="w-full h-full flex justify-center items-center ">
          <Image
            src="/green/folder_green.png"
            alt=""
            width={40}
            height={40}
            className="object-cover "
            style={{ objectFit: "cover", objectPosition: "center" }}
          />

          {session.user.email !== project.user.email &&
            !selectProjectTrigger && (
              <div className="absolute top-2 left-2  flex gap-2 ">
                <div className="border border-emerald-900 bg-emerald-900 rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  <p className="text-white text-xs">
                    {project.user.email[0].toLocaleUpperCase()}
                  </p>
                </div>
              </div>
            )}
          {session.user.email === project.user.email &&
            !selectProjectTrigger && (
              <div className="absolute top-2 left-2 ">
                <div className="border border-orange-600 bg-orange-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  <p className="text-white text-xs">
                    {project.user.email[0].toLocaleUpperCase()}
                  </p>
                </div>
              </div>
            )}

          {selectProjectTrigger && (
            <div
              className="absolute top-2 left-1 cursor-pointer flex gap-2 "
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
              }}
            >
              <TailwindCheckbox
                checked={
                  checkedProjects &&
                  checkedProjects.some(
                    (entry: CheckedProjects) => entry.project_id === project.id
                  )
                }
                onChange={(e) => handleCheckboxChange(e)}
              />
            </div>
          )}

          <div
            onClick={onToggleOpen}
            className="absolute top-2 right-2 cursor-pointer "
          >
            <Image src="/black/three-dots.png" alt="" width={20} height={20} />
          </div>
        </div>
      </div>
      <Link href={`/project/${project.id}`}>
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
            src="/green/folder_green.png"
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

interface SelectedProjectOptionsProps {
  checkedProjects: CheckedProjects[];
  setCheckedProjects: (value: any) => void;
  archive?: boolean;
}

interface NotOwner {
  id: number;
  name: string;
}

const SelectedProjectOptions = ({
  checkedProjects,
  setCheckedProjects,
  archive,
}: SelectedProjectOptionsProps) => {
  const projectIds = checkedProjects.map((project) => project.project_id);
  const { reloadProjects } = useSearchProjectContext();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [notOwner, setNotOwner] = useState<NotOwner[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  const deleteSelected = () => {
    startTransition(async () => {
      setDeleteConfirm(false);
      try {
        const check = (await checkProject(projectIds)) as [];
        setNotOwner(check);
        if (check.length === 0) {
          await deleteProjects(projectIds);
          toast.success("Projects deleted successfully");
          setCheckedProjects([]);
          reloadProjects();
        } else {
          setDeleteModalOpen(true);
        }
      } catch (error) {
        toast.error("Error deleting projects");
      }
    });
  };

  const deleteAllProjects = () => {
    startTransition(async () => {
      try {
        await deleteAll();
        setCheckedProjects([]);
        reloadProjects();
        toast.success("Projects deleted successfully");
      } catch (error) {
        toast.error("Error deleting projects");
      }
    });
  };

  const archiveSelected = () => {
    startTransition(async () => {
      try {
        await archiveProjects(projectIds);
        setCheckedProjects([]);
        reloadProjects();
        {
          archive
            ? toast.success("Projects removed from archive")
            : toast.success("Projects archived successfully");
        }
      } catch (error) {
        toast.error("Error archiving projects");
      }
    });
  };

  const archiveAllProjects = () => {
    startTransition(async () => {
      try {
        await archiveAll();
        setCheckedProjects([]);
        reloadProjects();
        {
          archive
            ? toast.success("Projects removed from archive")
            : toast.success("Projects archived successfully");
        }
      } catch (error) {
        toast.error("Error archiving projects");
      }
    });
  };

  return (
    <div
      className={`absolute  shadow-lg -right-2 top-10 rounded-lg  z-[2000] bg-white`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2 text-emerald-900">
        <div
          className={`bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer flex items-center`}
          onClick={() => {
            if (checkedProjects.length > 0) {
              setDeleteConfirm(true);
            } else {
              toast.error("No projects selected");
            }
          }}
        >
          <div className="flex gap-2 cursor-pointer">
            <Image
              src={"/green/trash_green.png"}
              width={15}
              height={15}
              alt=""
            ></Image>
            <p className="text-sm">Delete selected</p>
          </div>
        </div>
        <div
          className={`bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer flex items-center`}
          onClick={() => {
            setDeleteAllConfirm(true);
          }}
        >
          <div className="flex gap-2 cursor-pointer">
            <Image
              src={"/green/trash_green.png"}
              width={15}
              height={15}
              alt=""
            ></Image>
            <p className="text-sm">Delete All</p>
          </div>
        </div>
        <div
          className={`bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer flex items-center`}
          onClick={() => {
            if (checkedProjects.length > 0) {
              archiveSelected();
            } else {
              toast.error("No projects selected");
            }
          }}
        >
          <div className="flex gap-2 cursor-pointer">
            <Image src={"/archive.png"} width={20} height={20} alt=""></Image>
            <p className="text-sm">
              {archive ? "Unarchive selected" : "Archive selected"}
            </p>
          </div>
        </div>
        <div
          className={`bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer flex items-center`}
          onClick={archiveAllProjects}
        >
          <div className="flex gap-2 cursor-pointer">
            <Image src={"/archive.png"} width={20} height={20} alt=""></Image>
            <p className="text-sm">
              {archive ? "Unarchive all" : "Archive all"}
            </p>
          </div>
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
      {deleteModalOpen && (
        <ModalOverlay onClose={() => setDeleteModalOpen(false)}>
          <div className="p-8">
            <p>
              Cannot delete projects you are not the owner of. Please unselect
              these projects to continue.
            </p>
            {notOwner.map((project) => (
              <div key={project.id}>{project.name}</div>
            ))}
          </div>
        </ModalOverlay>
      )}
      {deleteConfirm && (
        <ModalOverlay isDelete={true} onClose={() => setDeleteConfirm(false)}>
          <DeleteConfirmationModal
            cancelClick={setDeleteConfirm}
            deleteClick={deleteSelected}
            isPending={isPending}
            type="Selected Projects"
            message={`Are you sure you want to delete the selected projects?`}
          />
        </ModalOverlay>
      )}
      {deleteAllConfirm && (
        <ModalOverlay
          isDelete={true}
          onClose={() => setDeleteAllConfirm(false)}
        >
          <DeleteConfirmationModal
            cancelClick={setDeleteAllConfirm}
            deleteClick={deleteAllProjects}
            isPending={isPending}
            type="All projects"
            message={`Are you sure you want to delete the all your projects? Note: only projects where you are the owner will be deleted.`}
          />
        </ModalOverlay>
      )}
    </div>
  );
};
