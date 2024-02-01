"use client";
import { useIsMobile } from "@/utils/useIsMobile";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between mb-10">
      <div className="flex gap-3">
        <h1 className="text-3xl font-bold">
          <Link href="/">STICKY NOTES</Link>
        </h1>
      </div>
      <div className="flex gap-3">
        <a href="/create-form" className="navbarItems">
          Create
        </a>
        <a href="" className="navbarItems">
          Return
        </a>

        <a href="" className="navbarItems">
          Alerts
        </a>
        <a href="/">Account</a>
      </div>
      <div className="navbarMobile">
        <a href="/create-form">Create</a>
        <a href="">Return</a>
        <a href="/">Search</a>
        <a href="">Alerts</a>
      </div>
    </div>
  );
};

// conditioanl rendering put receipts create and items in a dropdown
// move account

export default Navbar;
