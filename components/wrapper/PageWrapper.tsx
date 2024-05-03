import { auth } from "@/auth";
import { SearchBarContextProvider } from "@/components/context/SearchBarContext";
import Navbar from "@/components/navbar/Navbar";
import Topbar from "@/components/navbar/Topbar";
import SearchFetch from "@/components/search/SearchFetch";
import { getAlertsNumber } from "@/lib/alertNumber";
import { Session } from "@/types/Session";

import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = async ({ children }: PageWrapperProps) => {
  const session = (await auth()) as Session;

  return (
    <SearchBarContextProvider>
      <Topbar session={session}>
        <SearchFetch />
      </Topbar>
      <div className="flex bg-[#e2f1e2]">
        <Navbar session={session}>
          <SearchFetch />
        </Navbar>
        <div className="page main-content bg-[#e2f1e2] min-h-screen">
          <div className="">{children}</div>
        </div>
      </div>
    </SearchBarContextProvider>
  );
};

export default PageWrapper;
