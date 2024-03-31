"use client";
import { createProject } from "@/actions/projects/createProject";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import Loading from "@/components/Loading";

import { useState, useTransition } from "react";

interface AddProjectModalProps {
  setAddProjectOpen: (value: boolean) => void;
}

export const CreateProject = ({ setAddProjectOpen }: AddProjectModalProps) => {
  const [project, setProject] = useState("");
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (project === "") {
      setError("Please enter a project name");
    } else {
      startTransition(async () => {
        const result = await createProject(project);
        if (result.error) {
          setUploadError(result.error);
        } else {
          setProject("");
          setAddProjectOpen(false);
        }
      });
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
      <div className="bg-white rounded-md shadow-xl m-4 max-w-md w-full">
        <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3  rounded-t-lg">
          <h3 className="text-md text-emerald-900">Create Project</h3>
          <button
            type="button"
            className="text-emerald-900"
            onClick={() => setAddProjectOpen(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-emerald-900">Project name*</p>
                <input
                  type="text"
                  name="description"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full p-2 border-[1px]  rounded-md border-emerald-900"
                />
                {error && <p className="text-orange-900 text-xs">{error}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <RegularButton
                type="button"
                styles="text-emerald-900 border-emerald-900"
                handleClick={handleSubmit}
              >
                <p className="text-xs">Create Project</p>
              </RegularButton>
            </div>
          </div>

          {uploadError && <FormError message={uploadError} />}
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};
