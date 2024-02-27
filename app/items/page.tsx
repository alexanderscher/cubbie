import Header from "@/app/components/Header";
import Items from "@/app/components/Home/Items";
import { SearchItemProvider } from "@/app/components/context/SearchtemContext";
import { Suspense } from "react";

const HomeItems = () => {
  return (
    <div>
      <SearchItemProvider>
        <Header type="Items" />
        <Suspense fallback={<div>Loading...</div>}>
          <Items />
        </Suspense>
      </SearchItemProvider>
    </div>
  );
};

export default HomeItems;
