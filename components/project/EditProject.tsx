"use client";
import { editProject } from "@/actions/projects/editProject";
import { FormError } from "@/components/form-error";
import Loading from "@/components/Loading/Loading";
import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import { toast } from "sonner";
import React, { useState, useTransition } from "react";
import CurrencyInput from "react-currency-input-field";
import { ProjectType } from "@/types/ProjectTypes";
import SubmitButton from "@/components/buttons/SubmitButton";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";
import { usePathname } from "next/navigation";

interface EditProjectProps {
  setEdit: (value: boolean) => void;
  project: ProjectType;
}

export const EditProject = ({ setEdit, project }: EditProjectProps) => {
  const { reloadProjects } = useSearchProjectContext();

  const pathname = usePathname();

  const [editProjectObj, setProject] = useState({
    name: project.name,
    asset_amount: project.asset_amount ? project.asset_amount.toString() : "",
  });
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isPending, startTransition] = useTransition();
  const hasChanges =
    editProjectObj.name !== project.name ||
    parseFloat(editProjectObj.asset_amount) !== project.asset_amount;

  const handleSubmit = async () => {
    if (editProjectObj.name === "") {
      setError("Project name is required");
      return;
    }
    if (
      editProjectObj.name === project.name &&
      parseFloat(editProjectObj.asset_amount) === project.asset_amount
    ) {
      setEdit(false);
    } else if (editProjectObj.name !== "" && project.id) {
      startTransition(async () => {
        try {
          const result = await editProject(
            project.id,
            editProjectObj.name,
            editProjectObj.asset_amount
          );

          if (result.error) {
            setUploadError(result.error);
          } else {
            setEdit(false);
            reloadProjects();

            toast.success("Project edited successfully");
          }
        } catch (e) {
          toast.error("An error occurred. Please try again.");
        }
      });
    }
  };

  return (
    <div className=" w-full" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center border-b  px-5 py-3 rounded-t-lg border-emerald-900">
        <h3 className="text-md text-emerald-900">Edit Project</h3>
        <button
          type="button"
          className="text-emerald-900"
          onClick={(e) => {
            e.preventDefault();
            setEdit(false);
          }}
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
                value={editProjectObj.name}
                onChange={(e) =>
                  setProject({ ...editProjectObj, name: e.target.value })
                }
                className="w-full p-2 border-[1px] border-emerald-900 focus:outline-none rounded"
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
              placeholder={""}
              defaultValue={project.asset_amount ? project.asset_amount : ""}
              decimalsLimit={2}
              onValueChange={(value) => {
                setProject((prevState) => ({
                  ...prevState,
                  asset_amount: value || "",
                }));
              }}
            />
          </div>

          <div className="flex justify-end mt-2">
            <SubmitButton
              type="button"
              disabled={!hasChanges}
              handleClick={handleSubmit}
            >
              <p className="text-xs">Edit Project</p>
            </SubmitButton>
          </div>
        </div>

        {uploadError && <FormError message={uploadError} />}
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};
