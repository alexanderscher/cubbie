"use client";
import { archiveProject } from "@/actions/projects/archive";
import { deleteProject } from "@/actions/projects/deleteProject";
import Loading from "@/components/Loading/Loading";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { EditProject } from "@/components/project/EditProject";
import Image from "next/image";
import React, { use, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import { usePathname } from "next/navigation";
import { Formik } from "formik";
import { addUserToProject } from "@/actions/projects/addUserToProject";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import { removeUserFromProject } from "@/actions/projects/removeUserFromProject";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { formatCurrency } from "@/utils/formatCurrency";
import { sendInvite } from "@/actions/email/sendInvite";
import { leaveProject } from "@/actions/projects/leaveProject";
import { useRouter } from "next/navigation";
import { changeProjectOwner } from "@/actions/projects/transferOwnership";
import { ProjectItemType, ProjectType } from "@/types/ProjectTypes";
import { ReceiptType } from "@/types/ReceiptTypes";
import Link from "next/link";
import { Session } from "@/types/Session";

interface OptionsModalProps {
  isOpen: boolean;
  project: ProjectType;
  archived: boolean;
  session: Session;
}

const white = "bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2";
const green = "bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2";

export const ProjectOptionsModal = ({
  project,
  archived,
  session,
}: OptionsModalProps) => {
  console.log(project);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isAddOpen, setAddReceiptOpen] = useState(false);
  const [isAddUserOpen, setAddUserOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [color, setColor] = useState(white);
  const [isMemebersOpen, setMembersOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

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
    <div>
      <div
        className={`absolute  shadow-1 -right-2 top-10 rounded-lg w-[202px] z-[2000] ${
          pathname === "/" ? " bg-white" : " bg-[#97cb97] "
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div>
          <div className="p-4 rounded text-sm flex flex-col gap-2">
            {pathname.includes("project") && (
              <div
                className={`${color} cursor-pointer`}
                onClick={(e) => {
                  e.preventDefault();

                  setDetailsOpen(true);
                }}
              >
                <div className="flex gap-2">
                  <Image
                    src={"/dashboard_b.png"}
                    width={20}
                    height={20}
                    alt=""
                  ></Image>
                  <p>Project Details</p>
                </div>
              </div>
            )}
            {pathname.includes("project") && (
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
                  </div>
                </div>
              </div>
            )}
            {project.userId === session.user.id && (
              <div className={`${color} cursor-pointer`}>
                <div
                  className="flex gap-2 cursor-pointer"
                  onClick={toggleDeleteModal}
                >
                  <Image
                    src={"/trash.png"}
                    width={20}
                    height={20}
                    alt=""
                  ></Image>
                  <p>Delete project</p>
                </div>
              </div>
            )}
            {(project.subscription || session.user.planId === 2) && (
              <div className={`bg-[#d2edd2]  rounded-lg w-full p-2`}>
                <div className="flex gap-2 ">
                  <Image
                    src={"/checkmark.png"}
                    width={20}
                    height={20}
                    alt=""
                  ></Image>
                  <p>Subscribed</p>
                </div>
              </div>
            )}

            {!project.subscription && session.user.planId !== 2 && (
              <div
                className={`bg-orange-100 hover:bg-orange-200  rounded-lg w-full p-2`}
              >
                <div className="flex gap-2 cursor-pointer">
                  <Image
                    src={"/plus.png"}
                    width={20}
                    height={20}
                    alt=""
                  ></Image>
                  <Link href={"/manage-plan"}>
                    <p>Subscribe</p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div></div>
      {isDetailsOpen && (
        <ModalOverlay onClose={() => setDetailsOpen(false)}>
          <ProjectDetails project={project} setDetailsOpen={setDetailsOpen} />
        </ModalOverlay>
      )}
      {isPending && <Loading loading={isPending} />}
      {edit && (
        <ModalOverlay onClose={() => setEdit(false)}>
          <EditProject setEdit={setEdit} project={project} />
        </ModalOverlay>
      )}
      {isDeleteOpen && (
        <ModalOverlay isDelete={true} onClose={() => setIsDeleteOpen(false)}>
          <DeleteModal setDeleteOpen={setIsDeleteOpen} project={project} />
        </ModalOverlay>
      )}
      {isAddOpen && (
        <>
          <ModalOverlay onClose={() => setAddReceiptOpen(false)}>
            <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
          </ModalOverlay>
        </>
      )}
      {isAddUserOpen && (
        <ModalOverlay onClose={() => setAddUserOpen(false)}>
          <AddUser
            setMembersOpen={setMembersOpen}
            projectId={project.id}
            setAddUserOpen={setAddUserOpen}
          />
        </ModalOverlay>
      )}
      {isMemebersOpen && (
        <ModalOverlay onClose={() => setMembersOpen(false)}>
          <Members
            project={project}
            setMembersOpen={setMembersOpen}
            sessionUserId={session.user.id}
            setAddUserOpen={setAddUserOpen}
          />
        </ModalOverlay>
      )}
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
  const router = useRouter();

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
          router.push("/");
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
  return (
    <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full rounded-t-md">
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
          <div key={user.user.id}>
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
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  return (
    <div className="flex items-center border-t-[1px] justify-between gap-4 py-4 px-6 text-sm relative">
      <div className="flex items-center gap-2">
        <p className="text-emerald-900">{user.user?.name}</p>
        <p className="text-emerald-900">{user.user?.email}</p>
      </div>
      {sessionUserId && sessionUserId === user.user.id && (
        <div
          className="cursor-pointer"
          onClick={() => setIsLeaveOpen(!isLeaveOpen)}
        >
          <Image src="/three-dots.png" alt="" width={20} height={20} />
        </div>
      )}
      {sessionUserId && sessionUserId === projecUserId && (
        <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <Image src="/three-dots.png" alt="" width={20} height={20} />
        </div>
      )}

      {isOpen && <MembersOptionModal user={user} projectId={projectId} />}
      {isLeaveOpen && <LeaveProject user={user} projectId={projectId} />}
    </div>
  );
};

const LeaveProject = ({
  user,
  projectId,
}: {
  user: any;
  projectId: number;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const leave = async () => {
    startTransition(() => {
      try {
        leaveProject(projectId);
        router.push("/");
      } catch (e) {
        toast.error(
          "An error occurred while removing the user from the project"
        );
      }
    });
  };
  return (
    <div
      className={`absolute  bg-slate-200 shadow-lg -right-2 top-10 rounded-lg w-[260px] `}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div className="bg-slate-50	 cursor-pointer hover:bg-slate-100 rounded-lg w-full p-2">
          <div className="flex gap-4" onClick={leave}>
            <div>
              <Image
                src={"/account_b.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
            </div>

            <p>Leave Project</p>
          </div>
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
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

  const makeOwner = async () => {
    startTransition(() => {
      try {
        changeProjectOwner(projectId, user.user.id);
        toast.success("User is now the owner of the project");
      } catch (e) {
        toast.error("An error occurred while making the user the owner");
      }
    });
  };
  return (
    <div
      className={`absolute  bg-slate-200 shadow-lg -right-2 top-10 rounded-lg w-[260px] `}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div className="bg-slate-50	 cursor-pointer hover:bg-slate-100 rounded-lg w-full p-2">
          <div className="flex gap-4" onClick={removeUser}>
            <div>
              <Image
                src={"/account_b.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
            </div>

            <p>Remove {user.user.name}</p>
          </div>
        </div>
        <div className="bg-slate-50	 cursor-pointer hover:bg-slate-100 rounded-lg w-full p-2">
          <div className="flex gap-4" onClick={makeOwner}>
            <div>
              <Image
                src={"/account_b.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
            </div>

            <p>Make {user.user.name} the owner</p>
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

  const emailValidation = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email";
    }
    return "";
  };

  const sendEmail = async (email: string) => {
    startTransition(async () => {
      try {
        await sendInvite(email);
        setUploadError("");

        toast.success("Invite sent successfully");
      } catch (e) {
        toast.error("An error occurred while sending the invite");
      }
    });
  };

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      onSubmit={async (values) => {
        const isNotEmail = emailValidation(values.email);
        if (isNotEmail) {
          setInvalidEmailFormat(true);
          setUploadError("");

          return;
        }

        try {
          startTransition(async () => {
            const result = await addUserToProject(values.email, projectId);
            if (result.error) {
              setUploadError(result.error);

              setInvalidEmailFormat(false);
            } else {
              toast.success("Your operation was successful!");

              setInvalidEmailFormat(false);
              setUploadError("");
              console.log("email sent");
              setAddUserOpen(false);
              setMembersOpen(true);
            }
          });
        } catch (e) {
          toast.error("An error occurred. Please try again.");
        }
      }}
      // validationSchema={getValidationSchema(stage)}
    >
      {({ handleChange, handleSubmit, values }) => (
        <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full rounded-t-md">
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
              {uploadError &&
                uploadError.startsWith("User not found with email") && (
                  <div className="p-6 rounded-lg flex items-center w-full gap-4 text-sm bg-[#d2edd2] text-emerald-900 shadow flex-col">
                    <p className="text-sm">
                      Would you like to invite {values.email} to join Cubbie?
                    </p>
                    <RegularButton
                      handleClick={() => sendEmail(values.email)}
                      styles=" border-emerald-900 bg-emerald-900"
                    >
                      <p className="text-white text-xs">Send invite</p>
                    </RegularButton>
                  </div>
                )}
            </div>
          </form>
          {isPending && <Loading loading={isPending} />}
        </div>
      )}
    </Formik>
  );
};

const ProjectDetails = ({
  project,
  setDetailsOpen,
}: {
  project: ProjectType;
  setDetailsOpen: (value: boolean) => void;
}) => {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const totalAmount = project.receipts.reduce(
      (totalAcc: number, receipt: ReceiptType) => {
        const receiptTotal = receipt.items.reduce(
          (itemAcc: number, item: ProjectItemType) => {
            return itemAcc + item.price;
          },
          0
        );

        return totalAcc + receiptTotal;
      },
      0
    );

    setTotalAmount(totalAmount);
  }, [project]);

  return (
    <div className="">
      <div className="flex justify-between items-center border-b  px-5 py-3 rounded-t-lg border-emerald-900">
        <h3 className=" text-emerald-900">Project Details</h3>
        <button
          type="button"
          className="text-emerald-900 "
          onClick={() => setDetailsOpen(false)}
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>
      <div className="">
        <div className="p-4 ">
          <p className="text-slate-400 text-xs">Number of receipts</p>
          <p className="text-sm">{project.receipts.length}</p>
        </div>

        <div className="p-4 border-t-[1px] ">
          <p className="text-slate-400 text-xs ">Project total amount</p>
          <p className="text-sm">{formatCurrency(totalAmount)}</p>
        </div>
      </div>
    </div>
  );
};
