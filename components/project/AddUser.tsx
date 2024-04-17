"use client";
import { addUserToProject } from "@/actions/projects/addUserToProject";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import Loading from "@/components/Loading";
import { Formik } from "formik";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface AddReceiptModalProps {
  setMembersOpen?: (value: boolean) => void;
  setAddUserOpen: (value: boolean) => void;
  projectId: number;
}

export const AddUser = ({
  setAddUserOpen,
  projectId,
  setMembersOpen,
}: AddReceiptModalProps) => {
  const pathname = usePathname();
  const [invalidEmailFormat, setInvalidEmailFormat] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState("");

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      setAddUserOpen(false);
    }
  };

  const emailValidation = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email";
    }
    return "";
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-[2000] "
      onClick={(e) => {
        handleOverlayClick;
        e.preventDefault();
      }}
    >
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={async (values) => {
          const isNotEmail = emailValidation(values.email);
          if (isNotEmail) {
            setInvalidEmailFormat(true);
            return;
          }

          try {
            startTransition(async () => {
              const result = await addUserToProject(values.email, projectId);
              if (result.error) {
                setUploadError(result.error);
                toast.error("An error occurred. Please try again.");
              } else {
                toast.success("Your operation was successful!");

                setInvalidEmailFormat(false);
                setUploadError("");
              }
            });
          } catch (e) {
            toast.error("An error occurred. Please try again.");
          }
        }}
        // validationSchema={getValidationSchema(stage)}
      >
        {({ handleChange, handleSubmit }) => (
          <div className="bg-white rounded-md shadow-xl m-4 max-w-md w-full rounded-t-md">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3 ">
                {pathname.startsWith("/project") && setMembersOpen && (
                  <button
                    type="button"
                    className="text-emerald-900 "
                    onClick={() => {
                      setMembersOpen(true);
                      setAddUserOpen(false);
                    }}
                  >
                    <span className="text-sm">Back</span>
                  </button>
                )}
                <h3 className=" text-emerald-900">Add user</h3>
                <button
                  type="button"
                  className="text-emerald-900 "
                  onClick={() => setAddUserOpen(false)}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
              <div className="flex flex-col p-6 gap-6">
                <input
                  className="w-full border-[1px]  p-2 rounded border-emerald-900 focus:border-emerald-900 focus:outline-none cursor-pointer placeholder:text-xs text-sm"
                  // value={e.}
                  placeholder="Email"
                  onChange={handleChange("email")}
                  style={{ WebkitAppearance: "none" }}
                />
                <RegularButton
                  handleClick={() => handleSubmit()}
                  styles="bg-white border-emerald-900"
                >
                  <p className="text-emerald-900 text-xs">Add user</p>
                </RegularButton>
                {invalidEmailFormat && (
                  <FormError message="Invalid email format" />
                )}
                {uploadError && <FormError message={uploadError} />}
              </div>
            </form>
          </div>
        )}
      </Formik>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};
