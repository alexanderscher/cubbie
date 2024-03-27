"use client";
import { changeEmail, changePassword } from "@/actions/settings";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { EmailSchema, PasswordSchema } from "@/schemas";
import { Session } from "@/types/AppTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Formik } from "formik";
import React, { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./profile.module.css";

interface Props {
  session: Session;
}

const Account = ({ session }: Props) => {
  return (
    <div className={`${styles.layout} gap-6 `}>
      <div
        className={`${styles.header}  bg-white min-w-[200px] rounded shadow p-6 flex flex-col gap-6`}
      >
        <h1>User Profile</h1>
        <h1>Prefrences</h1>
        <h1>Alerts</h1>
        <h1>Plan & Billing</h1>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-[600px]">
        <div className="bg-white rounded p-6  flex flex-col gap-4">
          <div className="text-lg">
            <p>Account</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 ">
          <PersonalInformation session={session} />
          <Password />
        </div>
      </div>
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
    <div className="bg-white rounded-md shadow  w-full  p-6  justify-center">
      <Formik
        initialValues={{
          name: session?.user.name || undefined,
          email: session?.user.email || undefined,
        }}
        onSubmit={async (values) => {
          onSubmit(values);
        }}
      >
        {({
          handleSubmit,
          setFieldValue,
          values,
          handleChange,
          validateForm,
        }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
            <h1>Personal Information</h1>
            <div className="w-full">
              <p className="text-sm text-slate-300">Name</p>
              <input
                value={values.name}
                onChange={handleChange("name")}
                className="w-full border-[1px] border-slate-300 rounded-md  p-2"
                type="text"
              />
            </div>
            <div className="w-full">
              <p className="text-sm text-slate-300">Email</p>
              <input
                value={values.email}
                onChange={handleChange("email")}
                className="w-full border-[1px] border-slate-300 rounded-md  p-2"
                type="text"
              />
            </div>
            <div className="w-full">
              <p className="text-sm text-slate-300">Phone</p>
              <input
                className="w-full border-[1px] border-slate-300 rounded-md  p-2"
                type="text"
              />
            </div>
            <RegularButton
              type="submit"
              styles=" bg-black border-black text-white h-[40px]
            
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
            <div className="bg-white rounded-md shadow  w-full flex flex-col p-6 gap-4">
              <h1>Change Password</h1>
              <div className="w-full">
                <p className="text-sm text-slate-300">Current Password</p>
                <input
                  value={values.password}
                  onChange={handleChange("password")}
                  className="w-full border-[1px] border-slate-300 rounded-md h-[40px] p-2"
                  type="text"
                />
              </div>
              <div className="w-full">
                <p className="text-sm text-slate-300">New Password</p>
                <input
                  value={values.newPassword}
                  onChange={handleChange("newPassword")}
                  className="w-full border-[1px] border-slate-300 rounded-md h-[40px] p-2"
                  type="text"
                />
              </div>
              <RegularButton
                type="submit"
                styles=" bg-black border-black text-white h-[40px]
            
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
