"use client";
import Image from "next/image";
import styles from "./navbar.module.css";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Topbar = () => {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  return (
    <div
      className={`${styles.topbar} p-4 justify-between  bg-emerald-900 text-white`}
    >
      <Link href="/">Sticky Notes</Link>
      <button onClick={() => setMenu(!menu)}>Menu</button>
      {menu && (
        <div className={`${styles.menu} p-4 `}>
          <div className="flex flex-col gap-4 p-2">
            <Link href="/search">
              <p className="text-white text-4xl">Search</p>
            </Link>
            <Link href="/" className="flex ">
              <p className="text-white text-4xl">Receipts</p>
            </Link>
            <p className="text-white text-4xl">Calender</p>
            <p className="text-white text-4xl">Account</p>
            <p className="text-white text-4xl">Notifications</p>
          </div>
          {/* <div className={`${styles.navbarItems}`}>
            <div
              className={`${styles.linkWrapper} ${
                pathname === "/" ||
                pathname.includes("receipt") ||
                pathname.includes("memo") ||
                pathname.includes("item")
                  ? styles.page
                  : ""
              }`}
            >
              <Link href="/">
                <Image
                  src="/receipt_w.png"
                  alt=""
                  width={20}
                  height={20}
                  className="object-cover"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </Link>
            </div>

            <Link href="/">
              <Image
                src="/search_w.png"
                alt=""
                width={25}
                height={25}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Link>
            <Link href="/">
              <Image
                src="/account_w.png"
                alt=""
                width={25}
                height={25}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Link>
            <Link href="/">
              <Image
                src="/calendar_w.png"
                alt=""
                width={25}
                height={25}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Link>
            <Link href="/">
              <Image
                src="/notification_w.png"
                alt=""
                width={25}
                height={25}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Link>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Topbar;
