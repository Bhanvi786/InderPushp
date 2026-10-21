import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutPreview from "@/components/AboutPreview";
import Collections from "@/components/Collections";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#F8F4EA] flex flex-col relative overflow-x-hidden">
      <Header />
      <Hero />
      <Collections />
      <AboutPreview />
      <ContactSection />
      <Footer />
    </main>
  );
}

