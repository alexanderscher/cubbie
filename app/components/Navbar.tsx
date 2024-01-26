import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between mb-10">
      <div className="flex gap-3">
        <h1 className="sm:text-4xl sm:text-3xl text-2xl font-bold">
          <Link href="/">STICKY NOTES</Link>
        </h1>
      </div>
      <div className="flex gap-3">
        <a href="">Create</a>
        <a href="">Alerts</a>
        <a href="">Account</a>
      </div>
    </div>
  );
};

export default Navbar;
