"use client";
import { createProject } from "@/app/actions/projects/createProject";
import RegularButton from "@/app/components/buttons/RegularButton";

import { useState } from "react";

interface AddProjectModalProps {
  setAddProjectOpen: (value: boolean) => void;
}

export const CreateProject = ({ setAddProjectOpen }: AddProjectModalProps) => {
  const [project, setProject] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (project === "") {
      setError("Please enter a project name");
    }
    if (project !== "") {
      await createProject(project);

      setAddProjectOpen(false);
    }
  };

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      setAddProjectOpen(false);
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
          <h3 className="text-lg text-emerald-900">Create Project</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setAddProjectOpen(false)}
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
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full p-2 border-[1px]  rounded border-slate-300 focus:border-emerald-900 focus:outline-none"
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
              <p className="text-xs">Create Project</p>
            </RegularButton>
          </div>
        </div>
      </div>
    </div>
  );
};
