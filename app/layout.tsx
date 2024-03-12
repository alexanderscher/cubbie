import type { Metadata } from "next";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import localFont from "next/font/local";

import BaseLayout from "@/app/components/layouts/BaseLayout";
import { Providers } from "@/app/components/providers/SessionProvider";
import { SessionProvider } from "next-auth/react";

const myFont = localFont({
  src: "../font/SuisseIntl-Medium.woff",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  themeColor: "#ecd96f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${myFont.className}`}>
        <Providers>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
}
