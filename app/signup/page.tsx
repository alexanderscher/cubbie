"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

import Link from "next/link";

interface DataProps {
  name: string;
  email: string;
  password: string;
  subscribed: boolean;
}

export default function Signup() {
  const router = useRouter();
  const [data, setData] = useState<DataProps>({
    name: "",
    email: "",
    password: "",
    subscribed: false,
  });

  const loginUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn("credentials", { ...data, redirect: false });
    router.push("/home");
  };

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const registerUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (response.status === 400) {
      if (data.name === "") {
        setUsernameError(true);
      }
      if (data.email === "") {
        setEmailError(true);
      }
      if (data.password === "") {
        setPasswordError(true);
      }
    }

    if (response.status === 422) {
      setUserExists(false);
      setInvalid(true);
    }

    if (response.status === 409) {
      setInvalid(false);
      setUserExists(true);
    }

    if (response.status === 201) {
      loginUser(e);
    }
  };

  const [google, setGoogle] = useState(false);

  const loginUserGoogle = async () => {
    await signIn("google", { redirect: false, callbackUrl: "/" });
    setGoogle(true);
    if (google) {
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="w-3/4 min-w-[300px] max-w-[500px] ">
          <form onSubmit={registerUser} noValidate className="flex flex-col">
            <input
              className={` specific-input border-t-0 border-[3.5px] w-full h-[50px] px-3 focus:outline-none text-red-500 ${
                emailError
                  ? "border-blue-500 placeholder:text-blue-300"
                  : "border-red-500 placeholder:text-red-300"
              } ${passwordError ? "border-b-[3.5px]" : ""}`}
              id="email"
              name="email"
              type="text"
              placeholder={emailError ? "Email is required" : "Email"}
              required
              value={data.email}
              onChange={(e) => {
                setEmailError(false);
                setData({ ...data, email: e.target.value });
              }}
            />
            <input
              className={` specific-input border-t-0 border-[3.5px] w-full h-[50px] px-3 focus:outline-none text-red-500 ${
                passwordError
                  ? "border-blue-500 placeholder:text-blue-300"
                  : "border-red-500 placeholder:text-red-300"
              }`}
              id="password"
              name="password"
              type="password"
              placeholder={passwordError ? "Password is required" : "Password"}
              required
              value={data.password}
              onChange={(e) => {
                setPasswordError(false);
                setData({ ...data, password: e.target.value });
              }}
            />

            {userExists && (
              <p className="text-red-500 text-sm mt-2">User already exists</p>
            )}
            {invalid && (
              <p className="text-red-500 text-sm mt-2">
                Please provide a valid email address
              </p>
            )}
            <div className="flex flex-col  mt-5 items-center">
              <button
                type="submit"
                className=" text-red-500 font-bold  text-[22px] hover:line-through"
              >
                Submit
              </button>

              <p className="text-[22px] hover:line-through cursor-pointer text-red-300">
                <Link href="\login">Have an account? Log in</Link>
              </p>
            </div>
          </form>
          <div className="border-t-[3.5px] border-red-800 mt-10">
            <button
              className="border-[3.5px]  border-red-800 p-4 w-full  text-sm mt-11 relative flex items-center justify-center"
              onClick={loginUserGoogle}
            >
              <p className="hover:line-through text-[22px] text-red-800">
                Sign up with Google
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
