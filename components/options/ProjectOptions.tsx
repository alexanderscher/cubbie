"use client";
import { archiveProject } from "@/actions/projects/archive";
import { deleteProject } from "@/actions/projects/deleteProject";
import Loading from "@/components/Loading";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { EditProject } from "@/components/project/EditProject";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Project as ProjectType } from "@/types/AppTypes";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import { usePathname } from "next/navigation";
import { AddUser } from "@/components/project/AddUser";

interface OptionsModalProps {
  isOpen: boolean;
  project: ProjectType;
  archived: boolean;
}

const white = "bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2";
const green = "bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2";

export const ProjectOptionsModal = ({
  project,
  archived,
}: OptionsModalProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isAddUserOpen, setAddUserOpen] = useState(false);
  const [isAddOpen, setAddReceiptOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [color, setColor] = useState(white);
  const pathname = usePathname();
  console.log(archived);

  useEffect(() => {
    if (pathname === "/") {
      setColor(white);
    } else {
      setColor(green);
    }
  }, [pathname]);

  const toggleDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDeleteOpen(!isDeleteOpen);
  };

  const setArchive = async (projectId: number, archive: string) => {
    startTransition(async () => {
      try {
        await archiveProject(projectId, archive);
        toast.success("Your operation was successful!");
      } catch (e) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <div
      className={`absolute  shadow-1 -right-2 top-10 rounded-md w-[202px] ${
        pathname === "/" ? "z-[250] bg-white" : "z-[500] bg-[#97cb97] "
      }`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div
          className={`${color} cursor-pointer`}
          onClick={(e) => {
            e.preventDefault();

            setEdit(true);
          }}
        >
          <div className="flex gap-2">
            <Image src={"/account_b.png"} width={20} height={20} alt=""></Image>
            <p>Invite User</p>
          </div>
        </div>
        {pathname === "/" && (
          <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2">
            <div
              className="flex gap-2"
              onClick={(e) => {
                e.preventDefault();
                setAddReceiptOpen(true);
              }}
            >
              <Image src={"/add.png"} width={20} height={20} alt=""></Image>
              <p>Add receipt</p>
            </div>
          </div>
        )}

        <div
          className={`${color} cursor-pointer`}
          onClick={(e) => {
            e.preventDefault();

            setEdit(true);
          }}
        >
          <div className="flex gap-2">
            <Image src={"/edit.png"} width={20} height={20} alt=""></Image>
            <p>Edit project</p>
          </div>
        </div>
        {archived && (
          <div className={color}>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setArchive(project.id, "false");
              }}
            >
              <Image src={"/archive.png"} width={20} height={20} alt=""></Image>
              <p>Unarchive project</p>
            </div>
          </div>
        )}
        {!archived && (
          <div className={`${color} cursor-pointer`}>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setArchive(project.id, "true");
              }}
            >
              <div>
                {" "}
                <Image
                  src={"/archive.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
              </div>

              <div className="flex justify-between w-full">
                <p>Archive project</p>
                {/* <TooltipWithHelperIcon
                  iconColor="text-black"
                  content="Archiving this project will make its receipts and items hidden. You can unarchive this project at any time to restore visibility."
                /> */}
              </div>
            </div>
          </div>
        )}

        <div className={`${color} cursor-pointer`}>
          <div
            className="flex gap-2 cursor-pointer"
            onClick={toggleDeleteModal}
          >
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete project</p>
          </div>
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
      {edit && <EditProject setEdit={setEdit} project={project} />}
      {isDeleteOpen && (
        <DeleteModal
          setDeleteOpen={setIsDeleteOpen}
          project={project}
        ></DeleteModal>
      )}
      {isAddOpen && <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />}
      {isAddUserOpen && <AddUser setAddReceiptOpen={setAddUserOpen} />}
    </div>
  );
};

interface DeleteModalProps {
  setDeleteOpen: (value: boolean) => void;
  project: ProjectType;
}

const DeleteModal = ({ project, setDeleteOpen }: DeleteModalProps) => {
  const [uploadError, setUploadError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (!project.id) {
      setUploadError("No project selected for deletion");
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteProject(project.id);
        if (result?.error) {
          toast.error("An error occurred. Please try again.");
        } else {
          setDeleteOpen(false);
          toast.success("Your operation was successful!");
        }
      } catch (e) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <DeleteConfirmationModal
      cancelClick={setDeleteOpen}
      error={uploadError}
      deleteClick={handleSubmit}
      isPending={isPending}
      type="Project"
      message={`Are you sure you want to delete ${project.name}? This will delete all receipts and items in the project.`}
    />
  );
};
