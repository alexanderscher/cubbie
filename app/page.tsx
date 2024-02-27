"use client";
import Header from "@/app/components/Header";
import Receipts from "@/app/components/Home/Receipts";
import { useSearchBarContext } from "@/app/components/context/SearchBarContext";
import { SearchProvider } from "@/app/components/context/SearchContext";
import SearchAllItems from "@/app/components/search/AlItems";
import SearchBar from "@/app/components/search/SearchBar";
import { Suspense } from "react";

export default function Home() {
  const { searchBarOpen } = useSearchBarContext();
  return (
    <main className="flex flex-col pb-[400px]">
      <SearchProvider>
        <Suspense fallback={<div>Loading</div>}>
          {searchBarOpen && <SearchAllItems />}
          <Header type="Receipts" />
          <Receipts />
        </Suspense>
      </SearchProvider>
    </main>
  );
}
