"use client";
import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchBarContext } from "@/app/components/context/SearchBarContext";

const Navbar = () => {
  const pathname = usePathname();
  const { searchBarOpen, setSearchBarOpen } = useSearchBarContext();
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
        <div
          className={`${styles.linkWrapper} ${searchBarOpen && styles.page}`}
        >
          <button onClick={() => setSearchBarOpen(!searchBarOpen)}>
            <Image
              src="/search_w.png"
              alt=""
              width={20}
              height={20}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </button>
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
