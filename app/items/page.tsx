import Header from "@/components/headers/Header";
import Items from "@/components/Home/Items";
import { SearchItemProvider } from "@/components/context/SearchItemContext";
import { Suspense } from "react";
import { Item } from "@/types/AppTypes";
import { getItems } from "@/lib/itemsDB";
import PageWrapper from "@/components/wrapper/PageWrapper";

const fetchItems = async () => {
  const items = await getItems();

  return items as Item[];
};

export default async function HomeItems() {
  const items = await fetchItems();

  return (
    <PageWrapper>
      <SearchItemProvider>
        <div className="flex flex-col items-center">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="w-full max-w-[1090px]">
              <Header type="Items" />

              <Items items={items} />
            </div>
          </Suspense>
        </div>
      </SearchItemProvider>
    </PageWrapper>
  );
}
