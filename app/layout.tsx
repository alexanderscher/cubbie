import type { Metadata } from "next";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const myFont = localFont({
  src: "../font/SuisseIntl-Medium.woff",
});

export const metadata: Metadata = {
  title: "Cubbie",
  themeColor: "#ecd96f",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={` ${myFont.className}`}>
        <SessionProvider session={session}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <main className="bg-[#e2f1e2]">{children}</main>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
