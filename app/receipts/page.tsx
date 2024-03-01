import Receipts from "@/app/components/Home/Receipts";

import { SearchProvider } from "@/app/components/context/SearchContext";
import Header from "@/app/components/headers/Header";
import { Suspense } from "react";

export default function ReceiptPage() {
  return (
    <main className="flex flex-col pb-[400px]">
      <SearchProvider>
        <Suspense fallback={<div>Loading</div>}>
          <Header type="Receipts" />
          <Receipts />
        </Suspense>
      </SearchProvider>
    </main>
  );
}
