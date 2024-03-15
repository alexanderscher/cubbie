import Receipts from "@/app/components/Home/Receipts";
import { SearchReceiptProvider } from "@/app/components/context/SearchReceiptContext";
import Header from "@/app/components/headers/Header";
import { getReceipts } from "@/app/lib/db";
import { Receipt } from "@/types/fetchReceipts";

import { Suspense } from "react";

const fetchReceipts = async () => {
  const receipts = await getReceipts();
  console.log(receipts);

  return receipts as Receipt[];
};

export default async function ReceiptPage() {
  const receipts = await fetchReceipts();

  return (
    <main className="flex flex-col pb-[400px]">
      <SearchReceiptProvider>
        <Suspense fallback={<div>Loading</div>}>
          <Header type="Receipts" />
          <Receipts serverData={receipts} />
        </Suspense>
      </SearchReceiptProvider>
    </main>
  );
}
