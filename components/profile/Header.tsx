import React from "react";
import styles from "./profile.module.css";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <>
      <div
        className={`${styles.header}   min-w-[200px] shadow p-8 flex flex-col gap-4 h-screen -mt-6 -ml-8 -mb-[100px]`}
      ></div>
      <div
        className={`${styles.header} fixed   bg-white min-w-[200px] shadow p-8 flex flex-col gap-4 h-screen -mt-6 -ml-8 -mb-[100px] text-emerald-900`}
      >
        <h1 className="text-lg">Account</h1>
        <div className="flex flex-col gap-4 text-sm ">
          <Link href="/account/profile">
            <div className="flex gap-2 ml-1 w-full items-center">
              <div>
                <Image
                  src={"/green/account_green.png"}
                  alt="user image"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                />
              </div>

              <p>User Profile</p>
            </div>
          </Link>

          <Link href="/account/alerts">
            <div className="flex gap-2 ml-1 items-center">
              <div>
                <Image
                  src={"/green/notify_green.png"}
                  alt="user image"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                />
              </div>
              <p>Alert settings</p>
            </div>
          </Link>
          <Link href="/account/billing">
            <div className="flex gap-2 ml-1 items-center">
              <div>
                <Image
                  src={"/green/creditcard_green.png"}
                  alt="user image"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                />
              </div>
              <p>Plan & Billing</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
