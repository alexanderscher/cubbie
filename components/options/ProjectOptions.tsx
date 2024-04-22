"use client";
import { archiveProject } from "@/actions/projects/archive";
import { deleteProject } from "@/actions/projects/deleteProject";
import Loading from "@/components/Loading";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { EditProject } from "@/components/project/EditProject";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Project as ProjectType } from "@/types/AppTypes";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import { usePathname } from "next/navigation";
import { Formik } from "formik";
import { addUserToProject } from "@/actions/projects/addUserToProject";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import { removeUserFromProject } from "@/actions/projects/removeUserFromProject";

interface OptionsModalProps {
  isOpen: boolean;
  project: ProjectType;
  archived: boolean;
  sessionUserId: string | undefined;
}

const white = "bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2";
const green = "bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2";

export const ProjectOptionsModal = ({
  project,
  archived,
  sessionUserId,
}: OptionsModalProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isAddOpen, setAddReceiptOpen] = useState(false);
  const [isAddUserOpen, setAddUserOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [color, setColor] = useState(white);
  const [isMemebersOpen, setMembersOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setColor(white);
    } else {
      setColor(green);
    }
  }, [pathname]);

  const toggleDeleteModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDeleteOpen(!isDeleteOpen);
  };

  const setArchive = async (projectId: number, archive: string) => {
    startTransition(async () => {
      try {
        await archiveProject(projectId, archive);
        toast.success("Your operation was successful!");
      } catch (e) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <div
      className={`absolute  shadow-1 -right-2 top-10 rounded-md w-[202px] z-[2000] ${
        pathname === "/" ? " bg-white" : " bg-[#97cb97] "
      }`}
      onClick={(e) => e.preventDefault()}
    >
      <div>
        <div className="p-4 rounded text-sm flex flex-col gap-2">
          {sessionUserId && sessionUserId === project.userId && (
            <div
              className={`${color} cursor-pointer`}
              onClick={(e) => {
                e.preventDefault();

                setMembersOpen(true);
              }}
            >
              <div className="flex gap-2">
                <Image
                  src={"/account_b.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <p>Members</p>
              </div>
            </div>
          )}

          <div className={`${color} cursor-pointer`}>
            <div
              className="flex gap-2"
              onClick={(e) => {
                e.preventDefault();
                setAddReceiptOpen(true);
              }}
            >
              <Image src={"/add.png"} width={20} height={20} alt=""></Image>
              <p>Add receipt</p>
            </div>
          </div>

          <div
            className={`${color} cursor-pointer`}
            onClick={(e) => {
              e.preventDefault();

              setEdit(true);
            }}
          >
            <div className="flex gap-2">
              <Image src={"/edit.png"} width={20} height={20} alt=""></Image>
              <p>Edit project</p>
            </div>
          </div>
          {archived && (
            <div className={color}>
              <div
                className="flex gap-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setArchive(project.id, "false");
                }}
              >
                <Image
                  src={"/archive.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <p>Unarchive project</p>
              </div>
            </div>
          )}
          {!archived && (
            <div className={`${color} cursor-pointer`}>
              <div
                className="flex gap-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setArchive(project.id, "true");
                }}
              >
                <div>
                  {" "}
                  <Image
                    src={"/archive.png"}
                    width={20}
                    height={20}
                    alt=""
                  ></Image>
                </div>

                <div className="flex justify-between w-full">
                  <p>Archive project</p>
                  {/* <TooltipWithHelperIcon
                  iconColor="text-black"
                  content="Archiving this project will make its receipts and items hidden. You can unarchive this project at any time to restore visibility."
                /> */}
                </div>
              </div>
            </div>
          )}

          <div className={`${color} cursor-pointer`}>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={toggleDeleteModal}
            >
              <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
              <p>Delete project</p>
            </div>
          </div>
        </div>
      </div>

      <div className="z-[2000]">
        {isPending && <Loading loading={isPending} />}
        {edit && <EditProject setEdit={setEdit} project={project} />}
        {isDeleteOpen && (
          <DeleteModal
            setDeleteOpen={setIsDeleteOpen}
            project={project}
          ></DeleteModal>
        )}
        {isAddOpen && <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />}
        {isAddUserOpen && (
          <AddUser
            setMembersOpen={setMembersOpen}
            projectId={project.id}
            setAddUserOpen={setAddUserOpen}
          />
        )}
        {isMemebersOpen && (
          <Members
            project={project}
            setMembersOpen={setMembersOpen}
            sessionUserId={sessionUserId}
            setAddUserOpen={setAddUserOpen}
          />
        )}
      </div>
    </div>
  );
};

interface DeleteModalProps {
  setDeleteOpen: (value: boolean) => void;
  project: ProjectType;
}

const DeleteModal = ({ project, setDeleteOpen }: DeleteModalProps) => {
  const [uploadError, setUploadError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (!project.id) {
      setUploadError("No project selected for deletion");
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteProject(project.id);
        if (result?.error) {
          toast.error("An error occurred. Please try again.");
        } else {
          setDeleteOpen(false);
          toast.success("Your operation was successful!");
        }
      } catch (e) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <DeleteConfirmationModal
      cancelClick={setDeleteOpen}
      error={uploadError}
      deleteClick={handleSubmit}
      isPending={isPending}
      type="Project"
      message={`Are you sure you want to delete ${project.name}? This will delete all receipts and items in the project.`}
    />
  );
};

const Members = ({
  project,
  setMembersOpen,
  sessionUserId,
  setAddUserOpen,
}: {
  project: ProjectType;
  setMembersOpen: (value: boolean) => void;
  sessionUserId: string | undefined;
  setAddUserOpen: (value: boolean) => void;
}) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      setMembersOpen(false);
    }
  };

  console.log(sessionUserId, project.user?.id);

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-[2000] "
      onClick={(e) => {
        handleOverlayClick;
        e.preventDefault();
      }}
    >
      <div className="bg-white rounded-md shadow-xl m-4 max-w-md w-full rounded-t-md">
        {sessionUserId && sessionUserId === project.user?.id && (
          <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3 ">
            <button
              type="button"
              className="text-emerald-900 "
              onClick={() => {
                setMembersOpen(false);
                setAddUserOpen(false);
              }}
            >
              <span className="text-2xl">&times;</span>
            </button>

            <h3 className=" text-emerald-900">{`${project.name} members`}</h3>

            <button
              type="button"
              className="text-emerald-900 "
              onClick={() => {
                setMembersOpen(false);
                setAddUserOpen(true);
              }}
            >
              <span className="text-2xl">+</span>
            </button>
          </div>
        )}
        {sessionUserId && sessionUserId !== project.user?.id && (
          <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3 ">
            <h3 className=" text-emerald-900">{`${project.name} members`}</h3>
            <button
              type="button"
              className="text-emerald-900 "
              onClick={() => {
                setMembersOpen(false);
                setAddUserOpen(false);
              }}
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        )}
        <div className="flex flex-col ">
          <div className="flex items-cenfter justify-between gap-4 py-4 px-6 text-sm">
            <div className="flex items-center gap-2">
              <p className="text-emerald-900">{project.user?.name}</p>
              <p className="text-emerald-900">{project.user?.email}</p>
            </div>

            <p className="text-slate-500">Owner</p>
          </div>
          {project.projectUsers.map((user) => (
            <div key={user.id}>
              <MembersBlock
                user={user}
                projecUserId={project.user?.id}
                sessionUserId={sessionUserId}
                projectId={project.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MembersBlock = ({
  user,
  sessionUserId,
  projecUserId,
  projectId,
}: {
  user: any;

  sessionUserId: string | undefined;
  projecUserId: string | undefined;
  projectId: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center border-t-[1px] justify-between gap-4 py-4 px-6 text-sm relative">
      <div className="flex items-center gap-2">
        <p className="text-emerald-900">{user.user?.name}</p>
        <p className="text-emerald-900">{user.user?.email}</p>
      </div>
      {sessionUserId && sessionUserId === projecUserId && (
        <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <Image src="/three-dots.png" alt="" width={20} height={20} />
        </div>
      )}

      {isOpen && <MembersOptionModal user={user} projectId={projectId} />}
    </div>
  );
};

const MembersOptionModal = ({
  user,
  projectId,
}: {
  user: any;
  projectId: number;
}) => {
  const [isPending, startTransition] = useTransition();

  const removeUser = async () => {
    startTransition(() => {
      try {
        removeUserFromProject(user.user.id, projectId);
        toast.success("User removed from project");
      } catch (e) {
        toast.error(
          "An error occurred while removing the user from the project"
        );
      }
    });
  };
  return (
    <div
      className={`absolute  bg-slate-200 shadow-lg -right-2 top-10 rounded-md w-[260px] `}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div className="bg-slate-50	 cursor-pointer hover:bg-slate-100 rounded-md w-full p-2">
          <div className="flex gap-4" onClick={removeUser}>
            <Image src={"/receipt_b.png"} width={12} height={12} alt=""></Image>
            <p>Remove {user.user.name}</p>
          </div>
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};

interface AddReceiptModalProps {
  setMembersOpen: (value: boolean) => void;
  setAddUserOpen: (value: boolean) => void;
  projectId: number;
}

const AddUser = ({
  setAddUserOpen,
  projectId,
  setMembersOpen,
}: AddReceiptModalProps) => {
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
