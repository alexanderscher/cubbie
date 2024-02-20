import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/navbar/Navbar";
import Navbar from "@/app/components/navbar/Navbar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import localFont from "next/font/local";

import Head from "next/head";
import Topbar from "@/app/components/navbar/Topbar";

const myFont = localFont({
  src: "../font/SuisseIntl-Medium.woff",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#ffffff" />{" "}
      </Head>
      <body className={`bg-[#e2f1e2] ${myFont.className}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Topbar />
        <div className="flex">
          <Navbar />

          <div className="page main-content"> {children}</div>
        </div>
      </body>
    </html>
  );
}
