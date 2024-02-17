"use client";
import Navbar from "@/app/components/Navbar";
import React, { useState } from "react";

const Topbar = () => {
  const [menu, setMenu] = useState(false);
  return (
    <div className="topbar p-4 justify-between">
      <h1>Sticky Notes</h1>
      <button onClick={() => setMenu(!menu)}>Menu</button>
      {menu && (
        <div className="menu p-4">
          <button onClick={() => setMenu(!menu)}>Close</button>
          <div className="navbar-items">
            <a href="/">Receipts</a>
            <a href="/receipt-type">Upload</a>
            <a href="/items">Search</a>
            <a href="/">Account</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;

const Menu = () => {
  return (
    <div className="menu">
      <h1>Close</h1>
    </div>
  );
};
