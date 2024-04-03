import Receipts from "@/components/Home/Receipts";
import { SearchReceiptProvider } from "@/components/context/SearchReceiptContext";
import Header from "@/components/headers/Header";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getReceipts } from "@/lib/receiptsDB";
import { Receipt } from "@/types/AppTypes";

import { Suspense } from "react";

const receipt = async () => {
  const receipts = await getReceipts();

  return receipts as Receipt[];
};

export default async function ReceiptPage() {
  const receipts = await receipt();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center pb-[400px]">
        <SearchReceiptProvider>
          <Suspense fallback={<div>Loading</div>}>
            <div className="w-full max-w-[1090px]">
              <Header type="Receipts" />
              <Receipts serverData={receipts} />
            </div>
          </Suspense>
        </SearchReceiptProvider>
      </div>
    </PageWrapper>
  );
}
