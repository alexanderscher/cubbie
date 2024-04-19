"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import Receipt from "@/components/receiptComponents/Receipt";
import {
  Item,
  Project as ProjectType,
  Receipt as ReceiptType,
} from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useMemo, useState, useTransition } from "react";
import styles from "./project.module.css";
import { NoReceipts } from "@/components/receiptComponents/NoReceipts";
import { ProjectOptionsModal } from "@/components/options/ProjectOptions";
import { AddUser } from "@/components/project/AddUser";
import { removeUserFromProject } from "@/actions/projects/removeUserFromProject";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import Filters from "@/components/headers/Filters";
import { useSearchParams } from "next/navigation";
interface ProjectIdProps {
  project: ProjectType;
  sessionUserId: string | undefined;
}

export const ProjectId = ({ project, sessionUserId }: ProjectIdProps) => {
  const [isAddOpen, setAddReceiptOpen] = useState(false);
  const [addMembersModalOpen, setAddMembersModalOpen] = useState(false);

  const searchParams = useSearchParams();

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

  const sortFieldParam = searchParams.get("sort");
  const sortField = sortFieldParam?.startsWith("-")
    ? sortFieldParam.slice(1)
    : sortFieldParam;
  const sortOrder = sortFieldParam?.startsWith("-") ? "desc" : "asc";
  const getTotalPrice = (items: Item[]) =>
    items.reduce((acc, item) => acc + item.price, 0);

  const storeType = searchParams.get("storeType") || "all";

  const sortedAndFilteredData = useMemo(() => {
    const filteredByStoreType =
      storeType === "all"
        ? project.receipts
        : project.receipts.filter(
            (receipt) => receipt.type.toLocaleLowerCase() === storeType
          );
    const compareReceipts = (a: ReceiptType, b: ReceiptType) => {
      if (sortField === "price") {
        const totalPriceA = getTotalPrice(a.items);
        const totalPriceB = getTotalPrice(b.items);
        if (sortOrder === "asc") {
          return totalPriceB - totalPriceA;
        } else {
          return totalPriceA - totalPriceB;
        }
      } else {
        const dateA = new Date(
          a[sortField as keyof ReceiptType] as Date
        ).getTime();
        const dateB = new Date(
          b[sortField as keyof ReceiptType] as Date
        ).getTime();
        if (sortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      }
    };
    return filteredByStoreType.sort(compareReceipts);
  }, [project, storeType, sortField, sortOrder]);

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
      <div className="flex flex-col gap-8 mt-10 bg">
        <div className={`${styles.header} `}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl text-orange-600">{project.name}</h1>
              <p className="text-sm">
                Created on {formatDateToMMDDYY(project.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ">
            <RegularButton
              handleClick={() => setAddReceiptOpen(true)}
              styles=" border-orange-600 text-orange-600"
            >
              <p className="text-xs">Add receipt</p>
            </RegularButton>
            <RegularButton
              handleClick={() => setMembersOpen(true)}
              styles=" border-orange-600 text-orange-600"
            >
              <p className="text-xs">Members</p>
            </RegularButton>
            <div
              className={`relative border-[1px] border-orange-600 px-4 py-1 rounded-full cursor-pointer flex items-center ${
                isOpen &&
                "border-[1px] border-orange-600 px-4 py-1 rounded-full"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Image src="/three-dots.png" alt="" width={20} height={20} />
              {isOpen && (
                <ProjectOptionsModal
                  archived={isArchived}
                  isOpen={isOpen}
                  project={project}
                  sessionUserId={sessionUserId}
                />
              )}
            </div>
          </div>
          {isAddOpen && <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />}
        </div>
        <Filters />

        <>
          {searchParams.get("expired") === "all" ||
          !searchParams.get("expired") ? (
            sortedAndFilteredData.length === 0 ? (
              <NoReceipts
                setAddReceiptOpen={setAddReceiptOpen}
                addReceiptOpen={isAddOpen}
              />
            ) : (
              <div className="boxes">
                {sortedAndFilteredData.map((receipt: ReceiptType) => (
                  <Receipt
                    key={receipt.id}
                    receipt={receipt}
                    onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
                    isOpen={openReceiptId === receipt.id}
                  />
                ))}
              </div>
            )
          ) : null}

          {searchParams.get("expired") === "false" ? (
            sortedAndFilteredData.filter(
              (receipt: ReceiptType) => !receipt.expired
            ).length === 0 ? (
              <NoReceipts
                setAddReceiptOpen={setAddReceiptOpen}
                addReceiptOpen={isAddOpen}
              />
            ) : (
              <div className="boxes">
                {sortedAndFilteredData
                  .filter((receipt: ReceiptType) => !receipt.expired)
                  .map((receipt: ReceiptType) => (
                    <Receipt
                      key={receipt.id}
                      receipt={receipt}
                      onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
                      isOpen={openReceiptId === receipt.id}
                    />
                  ))}
              </div>
            )
          ) : null}

          {searchParams.get("expired") === "true" ? (
            sortedAndFilteredData.filter(
              (receipt: ReceiptType) => receipt.expired
            ).length === 0 ? (
              <NoReceipts
                setAddReceiptOpen={setAddReceiptOpen}
                addReceiptOpen={isAddOpen}
              />
            ) : (
              <div className="boxes">
                {sortedAndFilteredData
                  .filter((receipt: ReceiptType) => receipt.expired)
                  .map((receipt: ReceiptType) => (
                    <Receipt
                      key={receipt.id}
                      receipt={receipt}
                      onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
                      isOpen={openReceiptId === receipt.id}
                    />
                  ))}
              </div>
            )
          ) : null}
        </>
      </div>
      {isMemebersOpen && (
        <Members
          project={project}
          setMembersOpen={setMembersOpen}
          setAddMembersModalOpen={setAddMembersModalOpen}
          sessionUserId={sessionUserId}
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
  sessionUserId,
}: {
  project: ProjectType;
  setMembersOpen: (value: boolean) => void;
  setAddMembersModalOpen: (value: boolean) => void;
  sessionUserId: string | undefined;
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

  console.log(sessionUserId, project.user?.id);

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
        {sessionUserId && sessionUserId === project.user?.id && (
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
        )}
        {sessionUserId && sessionUserId !== project.user?.id && (
          <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3 ">
            <h3 className=" text-emerald-900">{`${project.name} members`}</h3>
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
          </div>
        )}
        <div className="flex flex-col ">
          <div className="flex items-cenfter justify-between gap-4 py-4 px-6 text-sm">
            <div className="flex items-center gap-2">
              <p className="text-emerald-900">{project.user?.name}</p>
              <p className="text-emerald-900">{project.user?.email}</p>
            </div>

            <p className="text-slate-500">Owner</p>
          </div>
          {project.projectUsers.map((user) => (
            <div key={user.id}>
              <MembersBlock
                user={user}
                projecUserId={project.user?.id}
                sessionUserId={sessionUserId}
                projectId={project.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MembersBlock = ({
  user,
  sessionUserId,
  projecUserId,
  projectId,
}: {
  user: any;

  sessionUserId: string | undefined;
  projecUserId: string | undefined;
  projectId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center border-t-[1px] justify-between gap-4 py-4 px-6 text-sm relative">
      <div className="flex items-center gap-2">
        <p className="text-emerald-900">{user.user?.name}</p>
        <p className="text-emerald-900">{user.user?.email}</p>
      </div>
      {sessionUserId && sessionUserId === projecUserId && (
        <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <Image src="/three-dots.png" alt="" width={20} height={20} />
        </div>
      )}

      {isOpen && <MembersOptionModal user={user} projectId={projectId} />}
    </div>
  );
};

const MembersOptionModal = ({
  user,
  projectId,
}: {
  user: any;
  projectId: number;
}) => {
  const [isPending, startTransition] = useTransition();

  const removeUser = async () => {
    startTransition(() => {
      try {
        removeUserFromProject(user.user.id, projectId);
        toast.success("User removed from project");
      } catch (e) {
        toast.error(
          "An error occurred while removing the user from the project"
        );
      }
    });
  };
  return (
    <div
      className={`absolute  bg-slate-200 shadow-lg -right-2 top-10 rounded-md w-[260px] `}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div className="bg-slate-50	 cursor-pointer hover:bg-slate-100 rounded-md w-full p-2">
          <div className="flex gap-4" onClick={removeUser}>
            <Image src={"/receipt_b.png"} width={12} height={12} alt=""></Image>
            <p>Remove {user.user.name}</p>
          </div>
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};
