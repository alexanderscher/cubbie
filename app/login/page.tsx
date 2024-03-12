"use client";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [google, setGoogle] = useState(false);
  const [missingEmail, setMissingEmail] = useState(false);
  const [missingPassword, setMissingPassowrd] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [invalidP, setInvalidP] = useState(false);

  const loginUserGoogle = async () => {
    await signIn("google", { redirect: false, callbackUrl: "/" });
    setGoogle(true);
    if (google) {
      router.push("/");
    }
  };

  const loginUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", { ...data, redirect: false });
    if (result?.error) {
      console.error(result?.error);
      if (result?.error === "Missing email or password") {
        if (data.email === "" && data.password === "") {
          setMissingEmail(true);
          setMissingPassowrd(true);
        } else if (data.email === "" && data.password !== "") {
          setMissingEmail(true);
          setMissingPassowrd(false);
        } else if (data.email !== "" && data.password === "") {
          setMissingEmail(false);
          setMissingPassowrd(true);
        }
      }
      if (result?.error === "User not found") {
        setNotFound(true);
      }
      if (result?.error === "Invalid password") {
        setInvalidP(true);
      }
    } else if (!result?.error) {
      setMissingEmail(false);
      setMissingPassowrd(false);
      setNotFound(false);
      setInvalidP(false);
      router.push("/");
    }
  };

  return (
    <div className="w-full h-screen">
      <div className=" flex flex-col w-full h-full items-center justify-center">
        <div className="w-3/4 min-w-[300px] max-w-[500px] ">
          <form noValidate onSubmit={loginUser} className={"flex flex-col "}>
            <input
              className={` specific-input w-full h-[50px] px-3 focus:outline-none border-[3.5px] text-red-500  ${
                missingEmail
                  ? "border-blue-500 placeholder:text-blue-300"
                  : "border-red-500 placeholder:text-red-300"
              }`}
              id="email"
              name="email"
              type="text"
              placeholder={missingEmail ? "Please fill out email" : "Email"}
              required
              value={data.email}
              onChange={(e) => {
                setMissingEmail(false);
                setData({ ...data, email: e.target.value });
              }}
            />
            <input
              className={` specific-input border-t-0 border-[3.5px] w-full h-[50px] px-3 focus:outline-none text-red-500 ${
                missingPassword
                  ? "border-blue-500 placeholder:text-blue-300"
                  : "border-red-500 placeholder:text-red-300"
              } `}
              id="password"
              name="password"
              type="password"
              placeholder={
                missingPassword ? "Please fill out password" : "Password"
              }
              required
              value={data.password}
              onChange={(e) => {
                setMissingPassowrd(false);
                setData({ ...data, password: e.target.value });
              }}
            />
            {notFound && (
              <p className="text-blue-500 text-sm mt-2">User not found</p>
            )}
            {invalidP && (
              <p className="text-blue-500 text-sm mt-2">Incorrect password</p>
            )}

            <div className="flex flex-col  mt-5 items-center">
              <button
                type="submit"
                className=" text-red-500 font-bold text-[22px] hover:line-through"
              >
                Log in
              </button>

              <p className="text-[22px] text-red-300 hover:line-through cursor-pointer">
                <Link href="/signup"> Create an account</Link>
              </p>
              <p className="text-[22px] text-red-300 hover:line-through cursor-pointer">
                <Link href="/auth/reset-password">Forgot password</Link>
              </p>
            </div>
          </form>
          <div className="border-t-[3.5px] border-red-800 mt-10">
            <button
              className="border-[3.5px]  border-red-800 p-4 w-full  text-sm mt-11 relative flex items-center justify-center"
              onClick={loginUserGoogle}
            >
              <p className="hover:line-through text-[22px] text-red-800">
                Log in with Google
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
