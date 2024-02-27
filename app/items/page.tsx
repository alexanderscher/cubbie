import Header from "@/app/components/Header";
import Items from "@/app/components/Home/Items";
import { SearchItemProvider } from "@/app/components/context/SearchtemContext";
import { Suspense } from "react";

const HomeItems = () => {
  return (
    <div>
      <SearchItemProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Header type="Items" />

          <Items />
        </Suspense>
      </SearchItemProvider>
    </div>
  );
};

export default HomeItems;
