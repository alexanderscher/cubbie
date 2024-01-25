import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/Header";

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
      <body className="p-2 bg-[#e2f1e2]">
        <Header />
        {children}
      </body>
    </html>
  );
}
