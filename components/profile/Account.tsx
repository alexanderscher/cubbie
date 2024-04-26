"use client";
import { changeEmail, changePassword } from "@/actions/settings";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { EmailSchema, PasswordSchema } from "@/schemas";
import { Session } from "@/types/AppTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Formik } from "formik";
import React, { startTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./profile.module.css";
import FormikInput from "@/components/ui/FormikInput";
import Image from "next/image";
import { Menu } from "@/components/profile/Menu";

interface Props {
  session: Session;
}

const Account = ({ session }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full max-w-[600px]">
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-emerald-900">User Profile</p>
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
