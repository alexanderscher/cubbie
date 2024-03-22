"use client";
import Image from "next/image";
import styles from "./navbar.module.css";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchBarContext } from "@/app/components/context/SearchBarContext";
import SearchAllItems from "@/app/components/search/AlItems";

const Topbar = () => {
  const [menu, setMenu] = useState(false);
  const { searchBarOpen, setSearchBarOpen } = useSearchBarContext();

  return (
    <div
      className={`${styles.topbar} p-4 justify-between  bg-emerald-900 text-white`}
    >
      <Link href="/">Sticky Notes</Link>
      <div className="flex gap-4">
        <div>
          <button
            onClick={() => {
              setSearchBarOpen(!searchBarOpen);

              setMenu(false);
            }}
          >
            <Image
              src="/search_w.png"
              alt=""
              width={15}
              height={15}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </button>
        </div>
        <button
          onClick={() => {
            setMenu(!menu);
            setSearchBarOpen(false);
          }}
        >
          Menu
        </button>
      </div>

      {searchBarOpen && (
        <div className={`${styles.menu} p-4 `}>
          <SearchAllItems />
        </div>
      )}

      {menu && (
        <div className={`${styles.menu} p-4 `}>
          <div className="flex flex-col gap-4 p-2">
            <div className="flex justify-between">
              <Link href="/">
                <p className="text-white text-3xl">Receipts</p>
              </Link>
              <div>
                <Image
                  src="/receipt_w.png"
                  alt=""
                  width={20}
                  height={20}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Link href="/">
                <p className="text-white text-3xl">Calender</p>
              </Link>
              <div>
                <Image
                  src="/calendar_w.png"
                  alt=""
                  width={25}
                  height={25}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Link href="/">
                <p className="text-white text-3xl">Account</p>
              </Link>
              <div>
                {" "}
                <Image
                  src="/account_w.png"
                  alt=""
                  width={25}
                  height={25}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Link href="/">
                <p className="text-white text-3xl">Notifications</p>
              </Link>
              <div>
                <Image
                  src="/notification_w.png"
                  alt=""
                  width={25}
                  height={25}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
