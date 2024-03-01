import Projects from "@/app/components/Home/Projects";
import Header from "@/app/components/headers/Header";

export default function Home() {
  return (
    <main className="flex flex-col pb-[400px]">
      <Header type="Projects" />
      <Projects />
    </main>
  );
}
