import Receipts from "@/components/Home/Receipts";
import RegularButton from "@/components/buttons/RegularButton";
import { SearchReceiptProvider } from "@/components/context/SearchReceiptContext";
import Returns from "@/components/returns/Returns";
import SearchBar from "@/components/search/SearchBar";
import PageWrapper from "@/components/wrapper/PageWrapper";
import Image from "next/image";

import { Suspense } from "react";

export default async function ReceiptPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center pb-[400px]">
        <SearchReceiptProvider>
          <Suspense fallback={<div>Loading</div>}>
            <Returns />
          </Suspense>
        </SearchReceiptProvider>
      </div>
    </PageWrapper>
  );
}
