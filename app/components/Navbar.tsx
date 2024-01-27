"use client";
import { useIsMobile } from "@/utils/useIsMobile";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const isMobile = useIsMobile();
  return (
    <div className="flex justify-between mb-10">
      <div className="flex gap-3">
        <h1 className="text-3xl font-bold">
          <Link href="/">STICKY NOTES</Link>
        </h1>
      </div>
      <div className="navbar">
        {isMobile && <a href="/">Home</a>}

        <a href="/create">Create</a>
        <a href="">Alerts</a>
        <a href="">Account</a>
      </div>
    </div>
  );
};

export default Navbar;
