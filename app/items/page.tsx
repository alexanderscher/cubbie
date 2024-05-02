import Header from "@/components/headers/Header";
import Items from "@/components/Home/Items";
import { SearchItemProvider } from "@/components/context/SearchItemContext";
import { Suspense } from "react";
import PageWrapper from "@/components/wrapper/PageWrapper";

export default async function HomeItems() {
  return (
    <PageWrapper>
      <SearchItemProvider>
        <div className="flex flex-col items-center">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="w-full max-w-[1090px]">
              <Header type="Items" />

              <Items />
            </div>
          </Suspense>
        </div>
      </SearchItemProvider>
    </PageWrapper>
  );
}
