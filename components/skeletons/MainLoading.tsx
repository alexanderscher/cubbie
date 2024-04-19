import React from "react";
import styles from "../navbar/navbar.module.css";
import Image from "next/image";
import { BeatLoader } from "react-spinners";

const MainLoading = () => {
  return (
    <div>
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
      className={`${styles.topbar} p-4 justify-between  bg-emerald-900 text-white`}
    >
      <h1>Cubbie</h1>
      <div className="flex gap-4">
        <div>
          <Image
            src="/search_w.png"
            alt=""
            width={15}
            height={15}
            className="object-cover "
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <h1>Menu</h1>
      </div>
    </div>
  );
};

const NavbarSkeleton = () => {
  return (
    <div className={`${styles.navbarFixed} p-2`}>
      <div className={`${styles.navbarItems} text-sm`}>
        <h1>Cubbie</h1>
        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/folder.png"
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
              src="/receipt_w.png"
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
              src="/item_w.png"
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
            <button className="flex flex-col justify-center items-center gap-2">
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
        </div>

        <div className={`${styles.linkWrapper} `}>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image
              src="/calendar_w.png"
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
              src="/notification_w.png"
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
        </div>
      </div>
    </div>
  );
};
