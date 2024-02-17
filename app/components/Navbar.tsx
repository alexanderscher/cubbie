import React from "react";

const Navbar = () => {
  return (
    <div className="navbar-fixed p-2">
      <div className="navbar-items text-xs">
        <a href="/">Receipts</a>
        <a href="/">Search</a>
        <a href="/receipt-type">Dashboard</a>
        <a href="/receipt-type">Calender</a>
        <a href="/receipt-type">Notifications</a>
        <a href="/">Account</a>
      </div>

      <div className="p-4 title">
        <a href="/" className="text-black">
          Sticky Notes
        </a>
      </div>
    </div>
  );
};

export default Navbar;
