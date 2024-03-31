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
    <div>
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
        <div className="flex justify-between bg-white p-4 rounded-md shadow">
          <div>
            <h1 className="text-xl text-orange-600">{project.name}</h1>
            <p className="text-sm">
              Created on {formatDateToMMDDYY(project.created_at)}
            </p>{" "}
          </div>
          <div className="flex items-center gap-3">
            <RegularButton
              handleClick={() => setEdit(!edit)}
              styles="bg-white border-emerald-900 text-emerald-900"
            >
              <p className="text-xs">Edit</p>
            </RegularButton>
            <RegularButton
              handleClick={() => setAddReceiptOpen(true)}
              styles="bg-emerald-900 border-emerald-900 text-white"
            >
              <p className="text-xs">Add receipt</p>
            </RegularButton>
          </div>
          {isAddOpen && <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />}
        </div>
        {project?.receipts?.length === 0 && (
          <div className="flex flex-col gap-6 justify-center items-center mt-10">
            <Image
              src="/receipt_b.png"
              alt=""
              width={30}
              height={30}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xl">No receipts found</p>
            <button
              className="border-[1px] bg text-orange-600 border-orange-600 py-2 px-10 text-xs rounded-full w-50"
              onClick={() => setAddReceiptOpen(true)}
            >
              <p className="">Create Receipt</p>
            </button>
            {isAddOpen && (
              <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
            )}
          </div>
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
