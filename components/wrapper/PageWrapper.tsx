import { auth } from "@/auth";
import { SearchBarContextProvider } from "@/components/context/SearchBarContext";
import Navbar from "@/components/navbar/Navbar";
import Topbar from "@/components/navbar/Topbar";
import SearchFetch from "@/components/search/SearchFetch";
import { getAlertsNumber } from "@/lib/alertNumber";
import { Alert, Session } from "@/types/AppTypes";

import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

const fetchAlert = async () => {
  const alerts = await getAlertsNumber();
  return alerts;
};

const PageWrapper = async ({ children }: PageWrapperProps) => {
  const session = (await auth()) as Session;
  const alerts = await fetchAlert();
  console.log("alerts", alerts);

  return (
    <SearchBarContextProvider>
      <Topbar session={session}>
        <SearchFetch />
      </Topbar>
      <div className="flex bg-[#e2f1e2]">
        <Navbar session={session} alerts={alerts}>
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
