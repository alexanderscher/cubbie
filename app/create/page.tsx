"use client";
import styles from "./upload.module.css";
import LargeButton from "@/components/buttons/LargeButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ReceiptType = () => {
  const router = useRouter();
  return (
    <div
      className=" flex flex-col h-full justify-center items-center"
      style={{ height: "calc(100vh - 250px)" }}
    >
      <div className="w-full sm:w-[600px] gap-8 flex flex-col justify-center items-center">
        <div className="flex justify-start w-full">
          <h1 className="text-2xl items-start text-emerald-900">
            Choose Receipt Type
          </h1>
        </div>

        <div className={`${styles.receiptTypes} `}>
          <LargeButton
            border={"none"}
            height={styles.boxes}
            styles="bg-white shadow flex flex-col gap-3 justify-center items-center"
            handleClick={() => router.push("/create/text")}
          >
            <Image src={"/text_b.png"} width={30} height={30} alt=""></Image>
            <p>Online</p>
          </LargeButton>
          <LargeButton
            border={"none"}
            height={styles.boxes}
            styles="bg-white shadow flex flex-col gap-3 justify-center items-center"
            handleClick={() => router.push("/create/image")}
          >
            <Image src={"/image_b.png"} width={30} height={30} alt=""></Image>
            <p>In Store</p>
          </LargeButton>
          <LargeButton
            border={"none"}
            height={styles.boxes}
            styles="bg-white shadow flex flex-col gap-3 justify-center items-center"
            handleClick={() => router.push("/create/memo")}
          >
            <Image src={"/receipt_b.png"} width={20} height={20} alt=""></Image>
            <p>Memo</p>
          </LargeButton>
        </div>
      </div>
    </div>
  );
};

export default ReceiptType;
