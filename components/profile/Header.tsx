import React from "react";
import styles from "./profile.module.css";
import Link from "next/link";

const Header = () => {
  return (
    <div
      className={`${styles.header}  text-emerald-900 bg-white min-w-[200px] rounded-lg shadow p-8 flex flex-col gap-4 `}
    >
      <h1 className="text-lg">Account</h1>
      <div className="flex flex-col gap-4 text-sm ">
        <Link href="/account/profile">
          <p>User Profile</p>
        </Link>

        <Link href="/account/alerts">
          <p>Alert Settings</p>
        </Link>
        <Link href="/account/billing">
          <p>Plan & Billing</p>
        </Link>
      </div>
    </div>
  );
};

export default Header;
