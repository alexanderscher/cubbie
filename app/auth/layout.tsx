import { LayoutProps } from "@/types/AppTypes";

import React from "react";

const layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-white">
      {children}
    </div>
  );
};

export default layout;
