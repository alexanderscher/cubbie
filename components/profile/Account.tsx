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
  return (
    <div
      className={`${styles.layout} gap-6 w-full justify-center items center`}
    >
      <div
        className={`${styles.header}  bg-white min-w-[200px] rounded shadow p-6 flex flex-col gap-4 `}
      >
        <h1 className="text-lg">Account</h1>
        <div className="flex flex-col gap-4 text-sm ">
          <h1>User Profile</h1>
          <h1>Prefrences</h1>
          <h1>Alerts</h1>
          <h1>Plan & Billing</h1>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-[600px]">
        <div className="bg-white rounded p-6  flex flex-col gap-4">
          <div className="flex justify-between">
            <p>User Profile</p>
            <div className={styles.button}>
              <Image
                src={"/dashboard_b.png"}
                alt="user image"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 ">
          <PersonalInformation session={session} />
          {!session.user.isOAuth && <Password />}
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
            <div className="bg-white rounded-md shadow  w-full flex flex-col p-6 gap-4">
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

// const Menu = () => {
//   return (
//     <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-5 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-4">Menu</h2>
//         <ul>
//           <li className="mb-2">Item 1</li>
//           <li className="mb-2">Item 2</li>
//           <li className="mb-2">Item 3</li>
//           <li className="mb-2">Item 4</li>
//         </ul>
//         <button
//           onClick={() => setIsOpen(false)}
//           className="mt-4 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 transition duration-200"
//         >
//           Close Menu
//         </button>
//       </div>
//     </div>
//   );
// }
