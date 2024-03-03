"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import Receipt from "@/app/components/receiptComponents/Receipt";
import { Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProjectID = () => {
  const { id } = useParams();
  const [project, setProject] = useState({
    name: "",
    created_at: "",
    receipts: [],
  });

  useEffect(() => {
    const getProject = async () => {
      const res = await fetch(`/api/project/${id}`);
      const data = await res.json();

      setProject(data.project);
    };
    getProject();
  }, [id]);

  return (
    <div>
      <div className="flex justify-between items-center gap-4 border-b-[1px] border-emerald-900 pb-4">
        <div className="flex gap-4">
          <Link href="/">
            <p className="text-emerald-900 hover:text-orange-600 text-sm">
              Projects
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
            <RegularButton styles="bg border-emerald-900 text-emerald-900">
              <p className="text-xs">Edit</p>
            </RegularButton>
            <RegularButton
              href="/receipt-type"
              styles="bg border-emerald-900 text-emerald-900"
            >
              <p className="text-xs">Add receipt</p>
            </RegularButton>
          </div>
        </div>
        <div className="boxes">
          {project.receipts.map((receipt: ReceiptType) => (
            <Receipt key={receipt.id} receipt={receipt} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectID;
