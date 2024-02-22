import Header from "@/app/components/Header";
import Receipts from "@/app/components/Home/Receipts";
import { SearchProvider } from "@/app/components/context/SearchContext";

export default function Home() {
  return (
    <main className="flex flex-col pb-[400px]">
      <SearchProvider>
        <Header type="Receipts" />
        <Receipts />
      </SearchProvider>
    </main>
  );
}
