"use client";
import { editProject } from "@/actions/projects/editProject";
import RegularButton from "@/components/buttons/RegularButton";
import Loading from "@/components/Loading";

import { Project as ProjectType } from "@/types/receiptTypes";

import React, { useState, useTransition } from "react";

interface EditProjectProps {
  setEdit: (value: boolean) => void;
  project: ProjectType;
}

export const EditProject = ({ setEdit, project }: EditProjectProps) => {
  const [name, setName] = useState(project.name);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (name === project.name || name === "") {
      setEdit(false);
    } else if (name !== "" && project.id) {
      startTransition(async () => {
        await editProject(project.id, name);

        setEdit(false);
      });
    }
  };
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
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
            onClick={(e) => {
              e.preventDefault();
              setEdit(false);
            }}
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
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};
