"use client";
import RegularButton from "@/components/buttons/RegularButton";
import Image from "next/image";
import styles from "./profile.module.css";
import { useState } from "react";
import { Menu } from "@/components/profile/Menu";

export const SubscribeForAlerts = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 w-full max-w-[700px]">
      <div className="bg-white rounded-lg  flex flex-col p-6">
        <div className="flex justify-between">
          <p className="text-lg text-emerald-900">Alert Settings</p>
          <div className={styles.button}>
            <Image
              src={"/dashboard_b.png"}
              alt="user image"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => {
                console.log(isOpen);
                setIsOpen(!isOpen);
              }}
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg  flex flex-col p-6 gap-6">
        <h1>Subscribe for alerts</h1>
        <RegularButton
          href="/manage-plan"
          styles="bg-orange-600 border-orange-600"
        >
          <p className="text-sm text-white"> View plans</p>
        </RegularButton>
      </div>
      {isOpen && <Menu setIsOpen={setIsOpen} />}
    </div>
  );
};
