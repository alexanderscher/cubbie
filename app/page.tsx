import Projects from "@/app/components/Home/Projects";
import { SearchProjectProvider } from "@/app/components/context/SearchProjectContext";
import Header from "@/app/components/headers/Header";
import { Suspense } from "react";

export default function Home() {
  return (
    <SearchProjectProvider>
      <main className="flex flex-col pb-[400px]">
        <Suspense fallback={<div>Loading</div>}>
          <Header type="Projects" />
          <Projects />
        </Suspense>
      </main>
    </SearchProjectProvider>
  );
}
