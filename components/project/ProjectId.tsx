"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { EditProject } from "@/components/project/EditProject";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import Receipt from "@/components/receiptComponents/Receipt";
import { Project as ProjectType } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import styles from "./project.module.css";
import { NoReceipts } from "@/components/receiptComponents/NoReceipts";

interface ProjectIdProps {
  project: ProjectType;
}

export const ProjectId = ({ project }: ProjectIdProps) => {
  console.log(project);
  const [edit, setEdit] = useState(false);
  const [isAddOpen, setAddReceiptOpen] = useState(false);

  const [openReceiptId, setOpenReceiptId] = useState(null as number | null);

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
        <div></div>
      </div>
      <div className="flex flex-col gap-8 mt-10">
        <div className={styles.header}>
          <div>
            <h1 className="text-xl text-orange-600">{project.name}</h1>
            <p className="text-sm">
              Created on {formatDateToMMDDYY(project.created_at)}
            </p>{" "}
          </div>
          <div className="flex items-center gap-2">
            <RegularButton
              handleClick={() => setEdit(!edit)}
              styles=" border-emerald-900 text-emerald-900"
            >
              <p className="text-xs">Edit</p>
            </RegularButton>
            <RegularButton
              handleClick={() => setAddReceiptOpen(true)}
              styles=" border-emerald-900 text-emerald-900"
            >
              <p className="text-xs">Add receipt</p>
            </RegularButton>
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
      {edit && <EditProject setEdit={setEdit} project={project} />}
    </div>
  );
};

export default ProjectId;
