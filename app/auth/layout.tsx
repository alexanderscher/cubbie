import { LayoutProps } from "@/types/receiptTypes";

import React from "react";

const layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      {children}
    </div>
  );
};

export default layout;
