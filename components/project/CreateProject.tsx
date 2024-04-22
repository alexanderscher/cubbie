"use client";
import { createProject } from "@/actions/projects/createProject";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import Loading from "@/components/Loading";
import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";

import { useState, useTransition } from "react";
import CurrencyInput from "react-currency-input-field";
import { toast } from "sonner";

interface AddProjectModalProps {
  setAddProjectOpen: (value: boolean) => void;
}

export const CreateProject = ({ setAddProjectOpen }: AddProjectModalProps) => {
  const [project, setProject] = useState({
    name: "",
    asset_amount: "",
  });
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (project.name === "") {
      setError("Please enter a project name");
    } else {
      try {
        startTransition(async () => {
          const result = await createProject(
            project.name,
            project.asset_amount
          );
          if (result.error) {
            setUploadError(result.error);
            toast.error("An error occurred. Please try again.");
          } else {
            toast.success("Your operation was successful!");
            setProject({
              name: "",
              asset_amount: "",
            });
            setAddProjectOpen(false);
          }
        });
      } catch (e) {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
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
              <p className="text-xs text-emerald-900 mb-2">Project name*</p>
              <input
                type="text"
                name="description"
                value={project.name}
                onChange={(e) =>
                  setProject({ ...project, name: e.target.value })
                }
                className="w-full p-2 border-[1px] rounded border-emerald-900 focus:outline-none"
              />
              {error && <p className="text-orange-900 text-xs">{error}</p>}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-2">
              <p className="text-xs text-emerald-900">Project Asset Amount</p>
              <TooltipWithHelperIcon content="Set a Project Asset Amount to determine the minimum cost an item must have to be considered an asset. This helps in identifying and tracking valuable items across all project receipts easily." />
            </div>

            <CurrencyInput
              id="assetAmount"
              name="assetAmount"
              className="w-full border-[1px]  p-2  border-emerald-900 rounded  focus:outline-none"
              placeholder=""
              defaultValue={""}
              decimalsLimit={2}
              onValueChange={(value) =>
                setProject({ ...project, asset_amount: value || "" })
              }
            />
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
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};
