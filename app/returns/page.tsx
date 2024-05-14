import { SearchReceiptProvider } from "@/components/context/SearchReceiptContext";
import Returns from "@/components/returns/Returns";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getPolicy } from "@/lib/getPolicy";

import { Suspense } from "react";

const getReturnPolicy = async () => {
  const returns = await getPolicy();
  return returns.items;
};

export default async function ReceiptPage() {
  const returns = await getReturnPolicy();
  return (
    <PageWrapper>
      <div className="flex flex-col items-center pb-[400px]">
        <SearchReceiptProvider>
          <Suspense fallback={<div>Loading</div>}>
            <Returns returns={returns} />
          </Suspense>
        </SearchReceiptProvider>
      </div>
    </PageWrapper>
  );
}
