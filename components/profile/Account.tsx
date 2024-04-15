"use client";
import { changeEmail, changePassword } from "@/actions/settings";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { EmailSchema, PasswordSchema } from "@/schemas";
import { Session } from "@/types/AppTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Formik } from "formik";
import React, { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./profile.module.css";
import FormikInput from "@/components/ui/FormikInput";
import Image from "next/image";

interface Props {
  session: Session;
}

const Account = ({ session }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      className={`${styles.layout} gap-6 w-full justify-center items center`}
    >
      <div
        className={`${styles.header}  text-emerald-900 bg-white min-w-[200px] rounded shadow p-6 flex flex-col gap-4 `}
      >
        <h1 className="text-lg">Account</h1>
        <div className="flex flex-col gap-4 text-sm ">
          <h1>User Profile</h1>
          <h1>Alerts</h1>
          <h1>Plan & Billing</h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-[600px]">
        <div className="bg-white rounded p-6  flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-emerald-900">User Profile</p>
            <div className={styles.button}>
              <Image
                src={"/dashboard_b.png"}
                alt="user image"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 ">
          <PersonalInformation session={session} />
          {!session.user.isOAuth && <Password />}
        </div>
      </div>
      {isOpen && <Menu setIsOpen={setIsOpen} />}
    </div>
  );
};

export default Account;

interface Props {
  session: Session;
}

const PersonalInformation = ({ session }: Props) => {
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const form = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      // password: undefined,
      // newPassword: undefined,
      name: session?.user.name || undefined,
      email: session?.user.email || undefined,
      // role: session?.user.role || undefined,
      // isTwoFactorEnabled: session?.user.isTwoFactorEnabled || undefined,
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
    <div className="bg-white rounded-md shadow  w-full  p-8  justify-center">
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
            <h1 className="text-emerald-900">Personal Information</h1>

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
              <p className="text-xs">Save Changes</p>
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
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
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
    <div className="bg-white rounded-md shadow  w-full justify-center">
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
            <div className="bg-white rounded-md shadow  w-full flex flex-col p-8 gap-4">
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
                <p className="text-xs">Save Changes</p>
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

interface MenuProps {
  setIsOpen: (value: boolean) => void;
}

const Menu = ({ setIsOpen }: MenuProps) => {
  return (
    <div
      className={`${styles.modal} fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center`}
    >
      <div className="bg-white  rounded-lg shadow-lg w-[300px] text-sm">
        {/* <h2 className="text-2xl font-bold mb-4">Menu</h2> */}
        <ul>
          <div className="border-b-[1px] border-slate-300 hover:bg-slate-100 rounded-t-lg">
            <li className="p-6">User Profile</li>
          </div>

          <div className="border-b-[1px] border-slate-300 hover:bg-slate-100 ">
            <li className="p-6">Alerts</li>
          </div>
          <div className="border-b-[1px] border-slate-300 hover:bg-slate-100 ">
            <li className="p-6">Plans & Billing</li>
          </div>
          <div
            onClick={() => setIsOpen(false)}
            className="p-6 hover:bg-slate-100 rounded-b-lg"
          >
            Close
          </div>
        </ul>
      </div>
    </div>
  );
};
