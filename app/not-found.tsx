import RegularButton from "@/components/buttons/RegularButton";

import React from "react";

const NotFound = () => {
  return (
    <div className="text-emerald-900 ">
      <div className="w-full flex flex-col h-screen red p-8 ">
        <div className="flex flex-col">
          <h1 className="text-[100px]">404</h1>
          <p className="text-[30px]">Page not found</p>

          <RegularButton styles="border-emerald-900 mt-6" href="/">
            <p className="text-sm">Home</p>
          </RegularButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
