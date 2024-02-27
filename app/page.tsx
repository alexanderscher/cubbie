import Header from "@/app/components/Header";
import Receipts from "@/app/components/Home/Receipts";
import { SearchProvider } from "@/app/components/context/SearchContext";
import SearchAllItems from "@/app/components/search/AllItems";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex flex-col pb-[400px]">
      <SearchProvider>
        <Header type="Receipts" />
        <Suspense fallback={<div>Loading...</div>}>
          <Receipts />
        </Suspense>
      </SearchProvider>
    </main>
  );
}
