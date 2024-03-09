"use client";
import RegularButton from "@/app/components/buttons/RegularButton";

import { Project as ProjectType } from "@/types/receipt";

import React, { useState } from "react";

interface EditProjectProps {
  setEdit: (value: boolean) => void;
  project: ProjectType;
  setRefresh: (value: boolean) => void;
}

export const EditProject = ({
  setEdit,
  project,
  setRefresh,
}: EditProjectProps) => {
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
      <div className="bg-white rounded shadow-xl m-4 max-w-md w-full">
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
