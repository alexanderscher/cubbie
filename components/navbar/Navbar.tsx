"use client";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchBarContext } from "@/components/context/SearchBarContext";
import { LogOutButton } from "@/components/LogOutButton";
import { useState } from "react";
import { Session } from "@/types/AppTypes";
import { Overlay } from "@/components/overlays/Overlay";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";

interface NavbarProps {
  session: Session;
  children: React.ReactNode;
  alerts: number;
}
const Navbar = ({ session, children, alerts }: NavbarProps) => {
  const pathname = usePathname();
  const { searchBarOpen, setSearchBarOpen } = useSearchBarContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <div className={`${styles.navbarFixed} p-2 `}>
        <div className={`${styles.navbarItems} text-sm`}>
          <Link href="/">Cubbie</Link>
          <div
            className={`${styles.linkWrapper} ${
              pathname === "/" || pathname.includes("project")
                ? styles.page
                : ""
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

          <div className={`${styles.linkWrapper} relative`}>
            <Link
              href="/alerts"
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
              {alerts > 0 && (
                <div className="absolute right-0.5 top-0.5 shadow-xl w-5 h-5 flex items-center justify-center text-xl  bg-orange-600 rounded-full cursor-pointer mb-4">
                  <p className="text-white text-xs ">{alerts}</p>
                </div>
              )}
            </Link>
          </div>
          <div className="relative">
            <div className={styles.linkWrapper}>
              <div
                className="flex flex-col justify-center items-center gap-2 cursor-pointer"
                onClick={toggleModal}
              >
                <Image
                  src="/account_w.png"
                  alt=""
                  width={25}
                  height={25}
                  className="object-cover"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                <p className="text-xs">Account</p>
              </div>
            </div>
            {isModalVisible && (
              <>
                <Modal session={session} />
                <Overlay onClose={toggleModal} />
              </>
            )}
          </div>
        </div>

        <div className={`${styles.title} p-4`}>
          <Link href="/" className="text-black">
            Cubbie
          </Link>
        </div>
      </div>
      {searchBarOpen && (
        <ModalOverlay onClose={() => setSearchBarOpen(false)}>
          <div
            className={`fixed top-0 w-[400px] left-[100px] h-screen bg-emerald-900 p-4 border-l-[1px] border-white overflow-y-scroll`}
          >
            {children}
          </div>
        </ModalOverlay>
      )}
    </>
  );
};

export default Navbar;

interface ModalProps {
  session: Session;
}

const Modal = ({ session }: ModalProps) => {
  return (
    <div className="absolute left-full top-0 mt-[-1rem] ml-2 w-48  bg-white shadow-lg rounded-lg border border-gray-200 flex flex-col  text-black z-[2000]">
      <div className="text-black border-b-[1px]">
        <p className="p-3">{session && session.user.name}</p>
      </div>

      <div className="flex flex-col ">
        <Link href="/account/profile" className="hover:bg-slate-100">
          <p className="p-3">Profile</p>
        </Link>
        <div className="hover:bg-slate-100 rounded-b-lg">
          <p className="text-black p-3">
            {session && <LogOutButton type="not" />}
          </p>
        </div>
      </div>
    </div>
  );
};
