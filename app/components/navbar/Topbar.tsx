"use client";
import Image from "next/image";
import styles from "./navbar.module.css";
import React, { useState } from "react";
import Link from "next/link";

const Topbar = () => {
  const [menu, setMenu] = useState(false);
  return (
    <div
      className={`${styles.topbar} p-4 justify-between  bg-emerald-900 text-white`}
    >
      <Link href="/">Sticky Notes</Link>
      <button onClick={() => setMenu(!menu)}>Menu</button>
      {menu && (
        <div className={`${styles.menu} p-4 border-l-[1.5px]`}>
          <div className={`${styles.navbarItems}`}>
            <button onClick={() => setMenu(!menu)}>Close</button>
            <Link href="/">
              <Image
                src="/receipt_w.png"
                alt=""
                width={25}
                height={25}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Link>

            <Link href="/">
              <Image
                src="/search_w.png"
                alt=""
                width={30}
                height={30}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Link>
            <Link href="/">
              <Image
                src="/account_w.png"
                alt=""
                width={30}
                height={30}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Link>
            <Link href="/">
              <Image
                src="/calendar_w.png"
                alt=""
                width={30}
                height={30}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Link>
            <Link href="/">
              <Image
                src="/notification_w.png"
                alt=""
                width={30}
                height={30}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
