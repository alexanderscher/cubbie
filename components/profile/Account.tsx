"use client";
import { changeEmail, changePassword } from "@/actions/settings";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { EmailSchema, PasswordSchema } from "@/schemas";
import { Session } from "@/types/Session";
import { zodResolver } from "@hookform/resolvers/zod";
import { Formik } from "formik";
import React, {
  startTransition,
  use,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./profile.module.css";
import FormikInput from "@/components/ui/FormikInput";
import Image from "next/image";
import { Menu } from "@/components/profile/Menu";
import { toast } from "sonner";
import { deleteAccount } from "@/actions/user/deleteAccount";
import Loading from "@/components/Loading/Loading";
import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { changeProjectOwner } from "@/actions/projects/transferOwnership";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/logout";
import { ProjectType, ProjectUserType } from "@/types/ProjectTypes";

interface AccountProps {
  session: Session;
  projects: ProjectType[];
}

interface Props {
  session: Session;
}

const Account = ({ session, projects }: AccountProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [deletePrompt, setDeletePrompt] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full max-w-[800px]">
      <div className="bg-white rounded-lg p-8  flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-emerald-900 text-xl">User Profile</p>
          <div className={styles.button}>
            <Image
              src={"/dashboard_b.png"}
              alt="user image"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => {
                console.log(isOpen);
                setIsOpen(!isOpen);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 ">
        <PersonalInformation session={session} />
        {!session.user.isOAuth && <Password />}
        <div className="bg-white rounded-lg shadow  w-full  p-8 flex flex-col justify-center gap-4">
          <div className="flex items-center gap-1">
            <h1 className="text-emerald-900 text-lg">Delete my account</h1>
            <TooltipWithHelperIcon
              content="Once deleted, you will lose all your data linked to your account. If
            you are a project owner, please transfer your projects to another
            account before deleting your account.
        "
            />
          </div>

          <RegularButton
            handleClick={() => setDeletePrompt(true)}
            type="submit"
            styles="mt-2  border-emerald-900 text-emerald-900 h-[40px] w-full
            
            "
          >
            <p className="text-sm">Delete my account</p>
          </RegularButton>
        </div>
      </div>
      {isOpen && <Menu setIsOpen={setIsOpen} />}
      {deletePrompt && (
        <ModalOverlay onClose={() => setDeletePrompt(false)}>
          <DeleteModal
            projects={projects}
            session={session}
            setDeletePrompt={setDeletePrompt}
          />
        </ModalOverlay>
      )}
    </div>
  );
};

export default Account;

interface Props {
  session: Session;
}

const PersonalInformation = ({ session }: Props) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      name: session?.user.name || undefined,
      email: session?.user.email || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof EmailSchema>) => {
    startTransition(() => {
      changeEmail(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
            setError("");
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };
  return (
    <div className="bg-white rounded-lg shadow  w-full  p-8  justify-center">
      <Formik
        initialValues={{
          name: session?.user.name || undefined,
          email: session?.user.email || undefined,
        }}
        onSubmit={async (values) => {
          onSubmit(values);
        }}
      >
        {({ handleSubmit, values, handleChange }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
            <h1 className="text-emerald-900 text-lg">Personal Information</h1>

            <FormikInput
              name={"Name"}
              value={values.name}
              onChange={handleChange("name")}
            />

            <FormikInput
              name={"Email"}
              value={values.email}
              onChange={handleChange("email")}
            />

            {/* <FormikInput name="Phone" values={values.phone} /> */}

            <RegularButton
              type="submit"
              styles="mt-2  border-emerald-900 text-emerald-900 h-[40px]
            
            "
            >
              <p className="text-sm">Save Changes</p>
            </RegularButton>
            <FormError message={error} />
            <FormSuccess message={success} />
          </form>
        )}
      </Formik>
    </div>
  );
};

const Password = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const form = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof PasswordSchema>) => {
    startTransition(() => {
      changePassword(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
            setError("");
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };
  return (
    <div className="bg-white rounded-lg shadow  w-full justify-center">
      <Formik
        initialValues={{
          password: "",
          newPassword: "",
        }}
        onSubmit={(values) => {
          if (values.password !== "" && values.newPassword !== "") {
            onSubmit(values);
          }
        }}
      >
        {({
          handleSubmit,

          values,
          handleChange,
        }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
            <div className="bg-white rounded-lg shadow  w-full flex flex-col p-8 gap-4">
              <h1 className="text-emerald-900">Change Password</h1>

              <FormikInput
                name={"Current Password"}
                value={values.password}
                onChange={handleChange("password")}
              />

              <FormikInput
                name={"New Password"}
                value={values.newPassword}
                onChange={handleChange("newPassword")}
              />
              <RegularButton
                type="submit"
                styles="mt-2  border-emerald-900 text-emerald-900 h-[40px]
            
            "
              >
                <p className="text-sm">Save Changes</p>
              </RegularButton>
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

interface DeleteModalProps {
  projects: ProjectType[];
  session: Session;
  setDeletePrompt: (value: boolean) => void;
}

interface CheckedUser {
  userId: string | undefined;
  projectId: number | null;
}
const DeleteModal = ({
  projects,
  session,
  setDeletePrompt,
}: DeleteModalProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [projectUsers, setProjectUsers] = useState(false);
  const [checkedUser, setCheckedUser] = useState<CheckedUser>({
    userId: "",
    projectId: null,
  });

  const handleCheckboxChange = (
    userId: string | undefined,
    projectId: number
  ) => {
    if (checkedUser.userId === userId) {
      setCheckedUser({
        userId: "",
        projectId: null,
      });
      return;
    }
    setCheckedUser({
      userId: userId,
      projectId: projectId,
    });
  };

  const deleteAccountCall = async () => {
    startTransition(() => {
      try {
        deleteAccount();
        toast.success("Account deleted successfully.");
        logout();
      } catch (e) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  const makeOwner = async () => {
    startTransition(() => {
      try {
        if (!checkedUser.projectId) {
          return;
        }
        if (!checkedUser.userId) {
          return;
        }
        changeProjectOwner(checkedUser.projectId, checkedUser.userId);
        toast.success("User is now the owner of the project");
      } catch (e) {
        toast.error("An error occurred while making the user the owner");
      }
    });
  };

  useEffect(() => {
    const hasOtherUsers = projects.some(
      (project) =>
        project.projectUsers.length > 0 && project.userId === session.user.id
    );
    setProjectUsers(hasOtherUsers);
  }, [projects, session.user.id]);

  if (!projectUsers) {
    return (
      <div className="w-full rounded-lg bg-red-50 flex flex-col gap-4 p-8 overflow-auto  items-center">
        <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px] ">
          <ExclamationTriangleIcon className=" text-red-500 w-3/4 h-1/2" />
        </div>
        <p className=" text-center text-red-400">
          Are you sure you want to delete your account? Once deleted, you will
          loose all your data.
        </p>
        <div className="flex  gap-2 w-full justify-between mt-4">
          <RegularButton
            styles="bg-red-50 border-red-400 text-red-400  w-full"
            handleClick={() => setDeletePrompt(false)}
          >
            <p className="text-sm">Cancel</p>
          </RegularButton>
          <RegularButton
            styles="bg-red-400 t border-red-400 t text-white  w-full"
            handleClick={deleteAccountCall}
          >
            <p className="text-sm">Delete account</p>
          </RegularButton>
        </div>
        {isPending && <Loading loading={isPending} />}
      </div>
    );
  }

  if (projectUsers) {
    return (
      <div className="w-full bg-red-50 flex flex-col gap-4 p-8 overflow-auto rounded-lg ">
        <div className="flex-col flex items-center w-full gap-4">
          <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px] ">
            <ExclamationTriangleIcon className=" text-red-500 w-3/4 h-1/2" />
          </div>
          <p className=" text-center">
            Caution: You are the owner of the following projects, which also
            include other users. If you proceed with deletion, please ensure
            ownership is transferred to another user. Otherwise, the projects
            will be deleted for all users.
          </p>
          {projects.map(
            (project) =>
              project.userId === session.user.id &&
              project.projectUsers.length > 0 && (
                <div
                  key={project.id}
                  className="bg-red-200 rounded-lg w-full flex flex-col gap-4 p-3"
                >
                  <p> {project.name}</p>
                  <div className="">
                    {project.projectUsers &&
                      project.projectUsers.map((user: ProjectUserType) => (
                        <div
                          key={user.user.id}
                          className="p-2 bg-red-300 rounded-lg flex justify-between items-center gap-2"
                        >
                          <p className="text-sm">{user.user.name}</p>
                          <label>
                            <input
                              type="checkbox"
                              checked={
                                checkedUser.userId === user.user.id &&
                                checkedUser.projectId === project.id
                              }
                              onChange={() =>
                                handleCheckboxChange(user.user.id, project.id)
                              }
                              value={user.user.id}
                            />
                          </label>
                        </div>
                      ))}
                  </div>
                  <RegularButton
                    styles={
                      checkedUser.projectId === project.id
                        ? "border-red-400 bg-red-400 "
                        : "border-red-400  "
                    }
                    handleClick={() => {
                      makeOwner();
                    }}
                  >
                    <p
                      className={
                        checkedUser.projectId === project.id
                          ? "text-white text-sm"
                          : "text-red-400 text-sm"
                      }
                    >
                      Transfer
                    </p>
                  </RegularButton>
                </div>
              )
          )}
        </div>
        <div className="flex  gap-2 w-full justify-between mt-4">
          <RegularButton
            styles="bg-red-50 border-red-400 text-red-400  w-full"
            handleClick={() => setDeletePrompt(false)}
          >
            <p className="text-sm">Cancel</p>
          </RegularButton>
          <RegularButton
            styles="bg-red-400 t border-red-400 t text-white  w-full"
            handleClick={deleteAccountCall}
          >
            <p className="text-sm">Delete account</p>
          </RegularButton>
        </div>

        {isPending && <Loading loading={isPending} />}
      </div>
    );
  }
};
