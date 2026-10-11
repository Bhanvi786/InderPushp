"use client";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    "Home",
    "About",
    "Collections",
    "Custom Commissions",
    "Contact",
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-50 pt-5 pb-3 px-6 md:px-12 xl:px-20 flex items-center justify-between">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center z-50 cursor-pointer w-auto">
        {/* Placeholder for the real logo image. Ensure you replace this src */}
        <div className="relative w-[150px] md:w-[200px] xl:w-[240px] h-[50px] md:h-[65px]">
          <Image 
            src="/logo.png" 
            alt="InderPushp House of Art" 
            fill 
            className="object-contain object-left"
            sizes="(max-width: 768px) 150px, (max-width: 1280px) 200px, 240px"
            priority
          />
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden xl:flex items-center gap-10">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className={`text-sm font-sans tracking-wide transition-colors pb-1 border-b-2 ${
              link === "Home" ? "text-gold border-gold" : "text-navy border-transparent hover:text-gold"
            }`}
          >
            {link}
          </a>
        ))}
      </nav>

      {/* Actions */}
      <div className="hidden xl:flex items-center gap-6 text-navy">
        <button aria-label="Search" className="hover:text-gold transition-colors">
          <Search size={22} strokeWidth={1.5} />
        </button>
        <button aria-label="Instagram" className="hover:text-gold transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
        </button>
      </div>

      {/* Mobile Actions */}
      <div className="xl:hidden flex items-center gap-5 z-50 text-navy">
        <button aria-label="Search">
          <Search size={24} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? (
            <X size={28} strokeWidth={1.5} />
          ) : (
            <Menu size={28} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-ivory z-40 flex flex-col justify-center items-center gap-8 p-6 animate-fade-up">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif text-navy hover:text-gold transition-colors"
            >
              {link}
            </a>
          ))}
          <div className="flex gap-6 mt-8 text-gold">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </div>
        </div>
      )}
    </header>
  );
}
