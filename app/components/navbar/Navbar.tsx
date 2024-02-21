"use client";
import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className={`${styles.navbarFixed} p-2`}>
      <div className={`${styles.navbarItems} text-sm`}>
        <Link href="/">Sticky Notes</Link>
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
        <div className={styles.linkWrapper}>
          <Link href="/">
            <Image
              src="/search_w.png"
              alt=""
              width={20}
              height={20}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </Link>
        </div>

        <div className={styles.linkWrapper}>
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
        </div>

        <div className={styles.linkWrapper}>
          {" "}
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
        </div>

        <div className={styles.linkWrapper}>
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
        </div>
      </div>

      <div className={`${styles.title} p-4`}>
        <Link href="/" className="text-black">
          Sticky Notes
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
