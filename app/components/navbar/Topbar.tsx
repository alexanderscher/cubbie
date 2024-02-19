"use client";
import styles from "./navbar.module.css";
import React, { useState } from "react";

const Topbar = () => {
  const [menu, setMenu] = useState(false);
  return (
    <div
      className={`${styles.topbar} p-4 justify-between border-b-[1.5px] border-emerald-900 bg-white text-emerald-900`}
    >
      <a href="/">Sticky Notes</a>
      <button onClick={() => setMenu(!menu)}>Menu</button>
      {menu && (
        <div className={`${styles.menu} p-4`}>
          <button onClick={() => setMenu(!menu)}>Close</button>
          <div className="flex flex-col gap-2 text-white ">
            <a href="/">Receipts</a>
            <a href="/">Search</a>
            <a href="/receipt-type">Dashboard</a>
            <a href="/receipt-type">Calender</a>
            <a href="/receipt-type">Notifications</a>
            <a href="/">Account</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
