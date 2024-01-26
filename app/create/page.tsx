import React from "react";

const page = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="w-1/2 flex justify-center items-center border-r-[1.5px] border-r-black">
        Create new receipt
      </div>
      <div className="w-1/2 flex justify-center items-center">
        Add to a current receipt
      </div>
    </div>
  );
};

export default page;
