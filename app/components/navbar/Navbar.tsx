import React from "react";
import styles from "./navbar.module.css";

const Navbar = () => {
  return (
    <div className={`${styles.navbarFixed} p-2`}>
      <div className={`${styles.navbarItems} text-sm`}>
        <a href="/">Receipts</a>
        <a href="/">Search</a>
        <a href="/receipt-type">Dashboard</a>
        <a href="/receipt-type">Calender</a>
        <a href="/receipt-type">Notifications</a>
        <a href="/">Account</a>
      </div>

      <div className={`${styles.title} p-4`}>
        <a href="/" className="text-black">
          Sticky Notes
        </a>
      </div>
    </div>
  );
};

export default Navbar;
