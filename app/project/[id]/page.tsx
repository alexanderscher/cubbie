"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
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
            <RegularButton
              handleClick={() => setEdit(!edit)}
              styles="bg border-emerald-900 text-emerald-900"
            >
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

interface EditProjectProps {
  setEdit: (value: boolean) => void;
  project: ProjectType;
  setRefresh: (value: boolean) => void;
}

const EditProject = ({ setEdit, project, setRefresh }: EditProjectProps) => {
  const [name, setName] = useState(project.name);
  const [error, setError] = useState("");

  const createProject = async () => {
    const res = await fetch(`/api/project/${project.id}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setError(data);
    console.log(data);
  };

  const handleSubmit = async () => {
    if (name === project.name || name === "") {
      setEdit(false);
    }
    if (name !== "" && name !== project.name) {
      await createProject();
      setEdit(false);
      setRefresh(true);
    }
  };

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      setEdit(false);
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[2000]"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full">
        <div className="flex justify-between items-center border-b border-gray-200 px-5 py-4 bg-slate-100 rounded-t-lg">
          <h3 className="text-lg text-emerald-900">Edit Project</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setEdit(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-emerald-900">Project name*</p>
              <input
                type="text"
                name="description"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border-[1px] border-slate-400 focus:border-emerald-900 focus:outline-none rounded"
              />
              {error && <p className="text-orange-900 text-xs">{error}</p>}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <RegularButton
              type="button"
              styles="bg-emerald-900 text-white border-emerald-900"
              handleClick={handleSubmit}
            >
              <p className="text-xs">Edit Project</p>
            </RegularButton>
          </div>
        </div>
      </div>
    </div>
  );
};
