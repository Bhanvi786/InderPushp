import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Collections from "@/components/Collections";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#F8F4EA] flex flex-col relative overflow-x-hidden">
      <Header />
      <Hero />
      <Collections />
    </main>
  );
}
