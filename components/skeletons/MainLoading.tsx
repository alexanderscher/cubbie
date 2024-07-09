import React from "react";
import styles from "../navbar/navbar.module.css";
import Image from "next/image";
import { BeatLoader } from "react-spinners";

const MainLoading = () => {
  return (
    <div className="w-full">
      <TopbarSkeleton />

      <div className="flex bg-[#e2f1e2]">
        <NavbarSkeleton />
        <div className="page main-content bg-[#e2f1e2] min-h-screen flex justify-center items-center">
          <BeatLoader size={15} color={"rgb(6 78 59)"} />
        </div>
      </div>
    </div>
  );
};

export default MainLoading;

const TopbarSkeleton = () => {
  return (
    <div
      className={`${styles.topbar} p-4 justify-between  bg-emerald-900 text-white w-full`}
    >
      <Image
        src="/logo/cubbielogowhite.png"
        alt=""
        width={30}
        height={30}
        className="object-cover "
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      <div className="flex gap-4">
        <div>
          <button>
            <Image
              src="/white/search_white.png"
              alt="search"
              width={15}
              height={15}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </button>
        </div>
        <button>
          <Image
            src="/white/hamburger_white.png"
            alt=""
            width={26}
            height={26}
            className="object-cover"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </button>
      </div>
    </div>
  );
};

const NavbarSkeleton = () => {
  return (
    <div className={`${styles.navbarFixed} p-2`}>
      <div className={`${styles.navbarItems} text-sm`}>
        <Image
          src="/logo/cubbielogowhite.png"
          alt=""
          width={50}
          height={50}
          className="object-cover "
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/white/folder_white.png"
              alt=""
              width={35}
              height={35}
              className="object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Projects</p>
          </div>
        </div>

        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/white/receipt_white.png"
              alt=""
              width={20}
              height={20}
              className="object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Receipts</p>
          </div>
        </div>
        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/white/item_w.png"
              alt=""
              width={35}
              height={35}
              className="object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Items</p>
          </div>
        </div>
        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/white/store_w.png"
              alt=""
              width={35}
              height={35}
              className="object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Returns</p>
          </div>
        </div>
        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <button className="flex flex-col justify-center items-center gap-2">
              <Image
                src="/white/search_white.png"
                alt=""
                width={20}
                height={20}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <p className="text-xs">Search</p>
            </button>
          </div>
        </div>

        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/white/calendar_white.png"
              alt=""
              width={25}
              height={25}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <p className="text-xs">Calender</p>
          </div>
        </div>

        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/white/notify_white.png"
              alt=""
              width={25}
              height={25}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />

            <p className="text-xs">Alerts</p>
          </div>
        </div>
        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="flex flex-col justify-center items-center gap-2 cursor-pointer">
              <Image
                src="/white/account_white.png"
                alt=""
                width={25}
                height={25}
                className="object-cover"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <p className="text-xs">Account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
