"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import Receipt from "@/components/receiptComponents/Receipt";
import { Project as ProjectType, User } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./project.module.css";
import { NoReceipts } from "@/components/receiptComponents/NoReceipts";
import { ProjectOptionsModal } from "@/components/options/ProjectOptions";
import { AddUser } from "@/components/project/AddUser";

interface ProjectIdProps {
  project: ProjectType;
}

export const ProjectId = ({ project }: ProjectIdProps) => {
  const [isAddOpen, setAddReceiptOpen] = useState(false);
  const [addMembersModalOpen, setAddMembersModalOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isMemebersOpen, setMembersOpen] = useState(false);
  const userId = project.userId;

  const [openReceiptId, setOpenReceiptId] = useState(null as number | null);

  const isArchived =
    project.projectUserArchive?.some(
      (entry) => entry.userId === userId?.toString()
    ) || false;

  const toggleOpenReceipt = (
    receiptId: number | undefined,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    if (receiptId === undefined) return;

    if (openReceiptId === receiptId) {
      setOpenReceiptId(null);
    } else {
      setOpenReceiptId(receiptId);
    }
  };

  return (
    <div className="flex flex-col  w-full h-full max-w-[1090px]">
      <div className="flex justify-between items-center gap-4 border-b-[1px] border-emerald-900 pb-4">
        <div className="flex gap-4">
          <Link href="/">
            <p className="text-emerald-900 hover:text-orange-600 text-sm">
              All Projects
            </p>
          </Link>
          <p className="text-emerald-900 text-sm">/</p>
          <p className="text-emerald-900 text-sm">{project.name}</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-10">
        <div className={styles.header}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl text-orange-600">{project.name}</h1>
              <p className="text-sm">
                Created on {formatDateToMMDDYY(project.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ">
            <RegularButton
              handleClick={() => setAddReceiptOpen(true)}
              styles=" border-emerald-900 text-emerald-900"
            >
              <p className="text-xs">Add receipt</p>
            </RegularButton>
            <RegularButton
              handleClick={() => setMembersOpen(true)}
              styles=" border-emerald-900 text-emerald-900"
            >
              <p className="text-xs">Members</p>
            </RegularButton>
            <div
              className={`relative hover:border-[1px] hover:border-emerald-900 px-4 py-1 rounded-full cursor-pointer flex items-center ${
                isOpen &&
                "border-[1px] border-emerald-900 px-4 py-1 rounded-full"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Image src="/three-dots.png" alt="" width={20} height={20} />
              {isOpen && (
                <ProjectOptionsModal
                  archived={isArchived}
                  isOpen={isOpen}
                  project={project}
                />
              )}
            </div>
          </div>
          {isAddOpen && <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />}
        </div>
        {project?.receipts?.length === 0 && (
          <NoReceipts
            setAddReceiptOpen={setAddReceiptOpen}
            addReceiptOpen={isAddOpen}
          />
        )}
        <div className="boxes">
          {project.receipts.map((receipt) => (
            <Receipt
              key={receipt.id}
              receipt={receipt}
              onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
              isOpen={openReceiptId === receipt.id}
            />
          ))}
        </div>
      </div>
      {isMemebersOpen && (
        <Members
          project={project}
          setMembersOpen={setMembersOpen}
          setAddMembersModalOpen={setAddMembersModalOpen}
        />
      )}
      {addMembersModalOpen && (
        <AddUser
          setAddUserOpen={setAddMembersModalOpen}
          setMembersOpen={setMembersOpen}
          projectId={project.id}
        />
      )}
    </div>
  );
};

export default ProjectId;

const Members = ({
  project,
  setMembersOpen,
  setAddMembersModalOpen,
}: {
  project: ProjectType;
  setMembersOpen: (value: boolean) => void;
  setAddMembersModalOpen: (value: boolean) => void;
}) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      setMembersOpen(false);
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-[2000] "
      onClick={(e) => {
        handleOverlayClick;
        e.preventDefault();
      }}
    >
      <div className="bg-white rounded-md shadow-xl m-4 max-w-md w-full rounded-t-md">
        <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3 ">
          <button
            type="button"
            className="text-emerald-900 "
            onClick={() => {
              setMembersOpen(false);
              setAddMembersModalOpen(false);
            }}
          >
            <span className="text-2xl">&times;</span>
          </button>

          <h3 className=" text-emerald-900">{`${project.name} members`}</h3>
          <button
            type="button"
            className="text-emerald-900 "
            onClick={() => {
              setMembersOpen(false);
              setAddMembersModalOpen(true);
            }}
          >
            <span className="text-2xl">+</span>
          </button>
        </div>
        <div className="flex flex-col ">
          <div className="flex items-center justify-between gap-4 py-4 px-6 text-sm">
            <div className="flex items-center gap-2">
              <p className="text-emerald-900">{project.user?.name}</p>
              <p className="text-emerald-900">{project.user?.email}</p>
            </div>

            <p className="text-slate-500">Owner</p>
          </div>
          {project.projectUsers.map((user) => (
            <div key={user.id}>
              <MembersBlock user={user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MembersBlock = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center border-t-[1px] justify-between gap-4 py-4 px-6 text-sm relative">
      <div className="flex items-center gap-2">
        <p className="text-emerald-900">{user.user?.name}</p>
        <p className="text-emerald-900">{user.user?.email}</p>
      </div>

      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Image src="/three-dots.png" alt="" width={20} height={20} />
      </div>
      {isOpen && <MembersOptionModal />}
    </div>
  );
};

const MembersOptionModal = () => {
  return (
    <div
      className={`absolute  shadow-1 -right-2 top-10 rounded-md w-[200px] bg-white`}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2">
          <div className="flex gap-4">
            <Image src={"/receipt_b.png"} width={12} height={12} alt=""></Image>
            <p>Remove user</p>
          </div>
        </div>
      </div>
    </div>
  );
};
