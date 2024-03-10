"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { EditProject } from "@/app/components/project/EditProject";
import { CreateReceipt } from "@/app/components/receiptComponents/CreateReceipt";
import Receipt from "@/app/components/receiptComponents/Receipt";
import {
  Project as ProjectType,
  Receipt as ReceiptType,
} from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProjectID = () => {
  const { id } = useParams();
  const [project, setProject] = useState({
    id: 0,
    name: "",
    created_at: "" as unknown as Date,
    receipts: [],
  });
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isAddOpen, setAddReceiptOpen] = useState(false);

  const [openReceiptId, setOpenReceiptId] = useState(null as number | null);

  const toggleOpenReceipt = (receiptId: number | undefined) => {
    if (receiptId === undefined) return;

    if (openReceiptId === receiptId) {
      setOpenReceiptId(null);
    } else {
      setOpenReceiptId(receiptId);
    }
  };

  useEffect(() => {
    const getProject = async () => {
      setLoading(true);
      const res = await fetch(`/api/project/${id}`);
      const data = await res.json();
      setProject(data.project);
      setLoading(false);
    };
    getProject();
  }, [id, refresh]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!loading && project.name === "") {
    return <p>Project not found</p>;
  }

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
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl text-orange-600">{project.name}</h1>
            <p>Created on {formatDateToMMDDYY(project.created_at)}</p>{" "}
          </div>
          <div className="flex items-center gap-3">
            <RegularButton
              handleClick={() => setEdit(!edit)}
              styles="bg border-emerald-900 text-emerald-900"
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
        {project.receipts.length === 0 && (
          <p className="">No receipts found for this project</p>
        )}
        <div className="boxes">
          {project.receipts.map((receipt: ReceiptType) => (
            <Receipt
              key={receipt.id}
              receipt={receipt}
              onToggleOpen={() => toggleOpenReceipt(receipt.id)}
              isOpen={openReceiptId === receipt.id}
            />
          ))}
        </div>
      </div>
      {edit && (
        <EditProject
          setEdit={setEdit}
          project={project}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default ProjectID;
