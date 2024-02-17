import React, { useState } from "react";

const Navbar = () => {
  return (
    <div className="navbar-fixed p-2">
      <div className="flex flex-col text-white gap-10 ">
        <div className="flex flex-col">
          <a href="/">Receipts</a>
          <a href="/memo">Memos</a>
          <a href="/items">Items</a>
          <a href="/receipt-type">Upload</a>
          <a href="/items">Search</a>
          <a href="/">Account</a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
