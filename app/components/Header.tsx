import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-3">
        <h1 className="text-4xl font-bold">
          <Link href="/">GIBBY</Link>
        </h1>
        {/* <input className="border-2" type="text" /> */}
      </div>
      <div className="flex gap-2">
        <a href="">Add</a>
        <a href="">Alerts</a>
        <a href="">Account</a>
      </div>
    </div>
  );
};

export default Header;
