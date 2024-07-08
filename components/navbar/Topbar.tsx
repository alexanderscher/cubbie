"use client";
import Image from "next/image";
import styles from "./navbar.module.css";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchBarContext } from "@/components/context/SearchBarContext";
import { LogOutButton } from "@/components/LogOutButton";
import { Session } from "@/types/Session";
import { getAlertsNumber } from "@/lib/alertNumber";

interface TopbarProps {
  session: Session;
  children: React.ReactNode;
}

const Topbar = ({ session, children }: TopbarProps) => {
  const [menu, setMenu] = useState(false);
  const { searchBarOpen, setSearchBarOpen } = useSearchBarContext();
  const [alerts, setAlerts] = useState(0);

  useEffect(() => {
    const fetchAlert = async () => {
      const alerts = await getAlertsNumber();
      return alerts;
    };
    fetchAlert().then((alerts) => {
      setAlerts(alerts);
    });
  }, []);
  return (
    <div
      className={`${styles.topbar} p-4 justify-between  bg-emerald-900 text-white`}
    >
      <Link onClick={() => setMenu(false)} href="/">
        Cubbie
      </Link>
      <div className="flex gap-4">
        <div>
          <button
            onClick={() => {
              setSearchBarOpen(!searchBarOpen);

              setMenu(false);
            }}
          >
            <Image
              src="/white/search_white.png"
              alt=""
              width={15}
              height={15}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </button>
        </div>
        <button
          onClick={() => {
            setMenu(!menu);
            setSearchBarOpen(false);
          }}
        >
          {menu ? (
            <Image
              src="/white/hamburger_white.png"
              alt=""
              width={26}
              height={26}
              className="object-cover"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                transform: "rotate(90deg)", // Rotates the image 90 degrees clockwise
              }}
            />
          ) : (
            <Image
              src="/white/hamburger_white.png"
              alt=""
              width={26}
              height={26}
              className="object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          )}
        </button>
      </div>

      {searchBarOpen && (
        <div className={`${styles.menu} p-4 overflow-y-scroll`}>{children}</div>
      )}

      {menu && (
        <div className={`${styles.menu} p-4 `}>
          <div className="flex flex-col gap-4 p-2">
            <Link
              className="flex justify-between"
              onClick={() => setMenu(false)}
              href="/"
            >
              <p className="text-white text-3xl">Projects</p>

              <div>
                <Image
                  src="/white/folder_white.png"
                  alt=""
                  width={30}
                  height={30}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </Link>

            <Link
              onClick={() => setMenu(false)}
              href="/receipts"
              className="flex justify-between "
            >
              <p className="text-white text-3xl">Receipts</p>

              <div className="">
                <Image
                  src="/white/receipt_white.png"
                  alt=""
                  width={20}
                  height={20}
                  className="object-cover mr-[5px]"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </Link>

            <Link
              className="flex justify-between"
              onClick={() => setMenu(false)}
              href="/items"
            >
              <p className="text-white text-3xl">Items</p>

              <div>
                <Image
                  src="/white/item_w.png"
                  alt=""
                  width={35}
                  height={35}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </Link>
            <Link
              className="flex justify-between"
              onClick={() => setMenu(false)}
              href="/returns"
            >
              <p className="text-white text-3xl">Returns</p>

              <div>
                <Image
                  src="/white/store_w.png"
                  alt=""
                  width={35}
                  height={35}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </Link>

            <Link
              className="flex justify-between"
              onClick={() => setMenu(false)}
              href="/calender"
            >
              <p className="text-white text-3xl">Calender</p>

              <div>
                <Image
                  src="/white/calendar_white.png"
                  alt=""
                  width={25}
                  height={25}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </Link>

            <Link
              onClick={() => setMenu(false)}
              className="flex justify-between"
              href="/alerts"
            >
              <p className="text-white text-3xl">Alerts</p>

              <div className="relative">
                <Image
                  src="/white/notify_white.png"
                  alt=""
                  width={25}
                  height={25}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                {alerts > 0 && (
                  <div className="absolute -right-3 -top-1 shadow-xl w-5 h-5 flex items-center justify-center text-xl  bg-orange-600 rounded-full cursor-pointer mb-4">
                    <p className="text-white text-xs">{alerts}</p>
                  </div>
                )}
              </div>
            </Link>

            <Link
              className="flex justify-between"
              onClick={() => setMenu(false)}
              href="/account/profile"
            >
              <p className="text-white text-3xl">Account</p>

              <div>
                {" "}
                <Image
                  src="/white/account_white.png"
                  alt=""
                  width={27}
                  height={27}
                  className="object-cover "
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </Link>
          </div>

          <div className="mt-10">{session && <LogOutButton />}</div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
