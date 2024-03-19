import { SearchBarContextProvider } from "@/app/components/context/SearchBarContext";
import Navbar from "@/app/components/navbar/Navbar";
import Topbar from "@/app/components/navbar/Topbar";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";

import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = async ({ children }: PageWrapperProps) => {
  const session = await getServerSession(authOptions);

  return (
    <SearchBarContextProvider>
      <Topbar />
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
