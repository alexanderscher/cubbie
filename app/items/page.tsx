import Header from "@/app/components/headers/Header";
import Items from "@/app/components/Home/Items";
import { SearchItemProvider } from "@/app/components/context/SearchItemContext";
import { Suspense } from "react";
import { Item } from "@/types/receiptTypes";
import { getItems } from "@/app/lib/itemsDB";
import PageWrapper from "@/app/components/wrapper/PageWrapper";

const fetchItems = async () => {
  const items = await getItems();
  console.log(items);

  return items as Item[];
};

export default async function HomeItems() {
  const items = await fetchItems();

  return (
    <PageWrapper>
      <SearchItemProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Header type="Items" />

          <Items items={items} />
        </Suspense>
      </SearchItemProvider>
    </PageWrapper>
  );
}
