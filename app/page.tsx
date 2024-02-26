import Header from "@/app/components/Header";
import Receipts from "@/app/components/Home/Receipts";
import { SearchProvider } from "@/app/components/context/SearchContext";
import SearchAllItems from "@/app/components/search/AllItems";

export default function Home() {
  return (
    <main className="flex flex-col pb-[400px]">
      {/* <SearchAllItems /> */}
      <SearchProvider>
        <Header type="Receipts" />
        <Receipts />
      </SearchProvider>
    </main>
  );
}
