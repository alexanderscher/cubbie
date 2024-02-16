import Header from "@/app/components/Header";
import Receipts from "@/app/components/Home/Receipts";

export default function Home() {
  return (
    <main className="flex flex-col pb-[400px]">
      <Header />
      <Receipts />
    </main>
  );
}
