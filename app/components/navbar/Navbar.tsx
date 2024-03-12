"use client";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchBarContext } from "@/app/components/context/SearchBarContext";
import SearchAllItems from "@/app/components/search/AlItems";
import { useSession } from "next-auth/react";
import { LogOutButton } from "@/app/components/LogOutButton";

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { searchBarOpen, setSearchBarOpen } = useSearchBarContext();
  return (
    <div className={`${styles.navbarFixed} p-2`}>
      <div className={`${styles.navbarItems} text-sm`}>
        <Link href="/">Sticky Notes</Link>
        <div
          className={`${styles.linkWrapper} ${
            pathname === "/" || pathname.includes("project") ? styles.page : ""
          }`}
        >
          <Link
            href="/"
            className="flex flex-col justify-center items-center gap-2"
          >
            <Image
              src="/folder.png"
              alt=""
              width={35}
              height={35}
              className="object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Projects</p>
          </Link>
        </div>
        <div
          className={`${styles.linkWrapper} ${
            pathname === "/receipts" || pathname.includes("receipt")
              ? styles.page
              : ""
          }`}
        >
          <Link
            href="/receipts"
            className="flex flex-col justify-center items-center gap-2"
          >
            <Image
              src="/receipt_w.png"
              alt=""
              width={20}
              height={20}
              className="object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Receipts</p>
          </Link>
        </div>
        <div
          className={`${styles.linkWrapper} ${
            pathname === "/items" || pathname.includes("item")
              ? styles.page
              : ""
          }`}
        >
          <Link
            href="/items"
            className="flex flex-col justify-center items-center gap-2"
          >
            <Image
              src="/item_w.png"
              alt=""
              width={35}
              height={35}
              className="object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Items</p>
          </Link>
        </div>
        <div
          className={`${styles.linkWrapper} ${searchBarOpen && styles.page}`}
        >
          <button
            className="flex flex-col justify-center items-center gap-2"
            onClick={() => {
              setSearchBarOpen(!searchBarOpen);
            }}
          >
            <Image
              src="/search_w.png"
              alt=""
              width={20}
              height={20}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Search</p>
          </button>
        </div>

        <div
          className={`${styles.linkWrapper} ${
            pathname === "/calender" ? styles.page : ""
          }`}
        >
          <Link
            href="/calender"
            className="flex flex-col justify-center items-center gap-2"
          >
            <Image
              src="/calendar_w.png"
              alt=""
              width={25}
              height={25}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Calender</p>
          </Link>
        </div>

        <div className={styles.linkWrapper}>
          <Link
            href="/"
            className="flex flex-col justify-center items-center gap-2"
          >
            <Image
              src="/notification_w.png"
              alt=""
              width={25}
              height={25}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Alerts</p>
          </Link>
        </div>
        <div className={styles.linkWrapper}>
          <Link
            href="/"
            className="flex flex-col justify-center items-center gap-2"
          >
            <Image
              src="/account_w.png"
              alt=""
              width={25}
              height={25}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Account</p>
          </Link>
        </div>

        <div>
          {session ? (
            <LogOutButton />
          ) : (
            <div className="flex flex-col">
              <Link href="/signup">Sign Up</Link>
              <Link href="/login">Login</Link>
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.title} p-4`}>
        <Link href="/" className="text-black">
          Sticky Notes
        </Link>
      </div>

      {searchBarOpen && (
        <div
          className={`fixed top-0 w-[400px] left-[100px] h-screen bg-emerald-900 p-4 border-l-[1px] border-white overflow-y-scroll`}
        >
          <SearchAllItems />
        </div>
      )}
    </div>
  );
};

export default Navbar;
