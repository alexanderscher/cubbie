import type { Metadata } from "next";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import localFont from "next/font/local";
import { Providers } from "@/components/providers/SessionProvider";

const myFont = localFont({
  src: "../font/SuisseIntl-Medium.woff",
});

export const metadata: Metadata = {
  title: "Cubbie",
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
          <main className="bg-[#e2f1e2]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
