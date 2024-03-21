import { auth } from "@/auth";
import { SearchBarContextProvider } from "@/components/context/SearchBarContext";
import Navbar from "@/components/navbar/Navbar";
import Topbar from "@/components/navbar/Topbar";

import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = async ({ children }: PageWrapperProps) => {
  const session = await auth();

  return (
    <SearchBarContextProvider>
      <Topbar session={session} />
      <div className="flex bg-[#e2f1e2]">
        <Navbar session={session} />
        <div className="page main-content bg-[#e2f1e2] min-h-screen">
          <div className="">{children}</div>
        </div>
      </div>
    </SearchBarContextProvider>
  );
};

export default PageWrapper;
