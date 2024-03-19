"use client";
import { useSearchBarContext } from "@/app/components/context/SearchBarContext";
import Image from "next/image";
import React from "react";
import styles from "./navbar.module.css";

const SearchButton = () => {
  const { searchBarOpen, setSearchBarOpen } = useSearchBarContext();
  return (
    <div className={`${styles.linkWrapper} ${searchBarOpen && styles.page}`}>
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
  );
};

export default SearchButton;
