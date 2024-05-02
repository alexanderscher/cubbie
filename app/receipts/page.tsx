import Receipts from "@/components/Home/Receipts";
import { SearchReceiptProvider } from "@/components/context/SearchReceiptContext";
import Header from "@/components/headers/Header";
import PageWrapper from "@/components/wrapper/PageWrapper";

import { Suspense } from "react";

export default async function ReceiptPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center pb-[400px]">
        <SearchReceiptProvider>
          <Suspense fallback={<div>Loading</div>}>
            <div className="w-full max-w-[1090px]">
              <Header type="Receipts" />
              <Receipts />
            </div>
          </Suspense>
        </SearchReceiptProvider>
      </div>
    </PageWrapper>
  );
}
