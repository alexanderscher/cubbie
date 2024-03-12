"use client";
import { SearchBarContextProvider } from "@/app/components/context/SearchBarContext";
import Topbar from "@/app/components/navbar/Topbar";
import Navbar from "@/app/components/navbar/Navbar";
import React from "react";
import { usePathname } from "next/navigation";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  const pathname = usePathname();

  if (pathname !== "/signup" && pathname !== "/login") {
    return (
      <SearchBarContextProvider>
        <Topbar />
        <div className="flex bg-[#e2f1e2]">
          <Navbar />

          <div className="page main-content bg-[#e2f1e2] min-h-screen">
            <main className="">{children}</main>
          </div>
        </div>
      </SearchBarContextProvider>
    );
  } else {
    return (
      <div className="flex bg-[#e2f1e2]">
        <div className="page main-content bg-[#e2f1e2] min-h-screen">
          <main className="">{children}</main>
        </div>
      </div>
    );
  }
};

export default BaseLayout;
