"use client";
import { useState } from "react";
import { Menu, Search, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount, cartBump } = useCart();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const allNavLinks = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/#collections" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/#contact" },
  ];

  // On subpages (e.g. /cart, /about), display strictly the "Home" option
  const navLinks = isHomePage ? allNavLinks : [{ label: "Home", href: "/" }];

  return (
    <header className="absolute top-0 left-0 w-full z-50 pt-2.5 pb-2 px-6 md:px-12 xl:px-20 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex flex-col items-center justify-center z-50 cursor-pointer w-auto">
        <div className="relative w-[115px] md:w-[145px] xl:w-[165px] h-[36px] md:h-[44px]">
          <Image 
            src="/logo.png" 
            alt="InderPushp House of Art" 
            fill 
            className="object-contain object-left"
            sizes="(max-width: 768px) 115px, (max-width: 1280px) 145px, 165px"
            priority
          />
        </div>
      </Link>

      {/* Navigation */}
      {isHomePage ? (
        <nav className="hidden xl:flex items-center gap-10">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-sans tracking-wide transition-colors pb-1 border-b-2 ${
                item.label === "Home"
                  ? "text-gold border-gold"
                  : "text-navy border-transparent hover:text-gold"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : (
        /* On Subpages: Perfectly Centered "Home" Option across all screen sizes */
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-40">
          <Link
            href="/"
            className="text-sm sm:text-base font-sans tracking-wide text-gold border-b-2 border-gold pb-0.5 hover:text-navy transition-colors font-medium select-none"
          >
            Home
          </Link>
        </div>
      )}

      {/* Actions (Desktop: Search, Instagram, Cart - only on Homepage) */}
      {isHomePage ? (
        <div className="hidden xl:flex items-center gap-6 text-navy">
          <button aria-label="Search" className="hover:text-gold transition-colors">
            <Search size={22} strokeWidth={1.5} />
          </button>
          <a
            href="https://www.instagram.com/_inderpushp?exln=Z2tuNXNwOXZ5Ym40"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @_inderpushp"
            className="hover:text-gold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>

          {/* Cart Icon navigating to full-screen cart page */}
          <Link
            href="/cart"
            aria-label="View Shopping Cart"
            className="relative p-2 rounded-full hover:bg-gold/10 text-navy hover:text-gold transition-all duration-300 flex items-center justify-center group"
          >
            <ShoppingBag
              size={22}
              strokeWidth={1.5}
              className={`transition-transform ${cartBump ? 'scale-125 text-gold animate-cart-bump' : 'group-hover:scale-105'}`}
            />
            {totalCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-navy text-gold border border-gold/40 text-[10px] font-sans font-bold flex items-center justify-center shadow-xs transition-transform ${
                  cartBump ? 'animate-cart-bump scale-110' : ''
                }`}
              >
                {totalCount > 99 ? '99+' : totalCount}
              </span>
            )}
          </Link>
        </div>
      ) : (
        /* Empty placeholder on subpages to balance header flex container */
        <div className="w-[115px] md:w-[145px] xl:w-[165px] h-[36px] md:h-[44px] pointer-events-none" aria-hidden="true" />
      )}

      {/* Mobile Actions (Only on Homepage) */}
      {isHomePage && (
        <div className="xl:hidden flex items-center gap-4 z-50 text-navy">
          {/* Mobile Cart Button */}
          <Link
            href="/cart"
            aria-label="View Shopping Cart"
            className="relative p-1.5 rounded-full hover:bg-gold/10 text-navy hover:text-gold transition-colors"
          >
            <ShoppingBag
              size={22}
              strokeWidth={1.5}
              className={cartBump ? 'scale-125 text-gold animate-cart-bump' : ''}
            />
            {totalCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-navy text-gold border border-gold/40 text-[9px] font-sans font-bold flex items-center justify-center shadow-xs ${
                  cartBump ? 'animate-cart-bump' : ''
                }`}
              >
                {totalCount > 99 ? '99+' : totalCount}
              </span>
            )}
          </Link>

          <button aria-label="Search">
            <Search size={22} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X size={26} strokeWidth={1.5} />
            ) : (
              <Menu size={26} strokeWidth={1.5} />
            )}
          </button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-ivory z-40 flex flex-col justify-center items-center gap-8 p-6 animate-fade-up">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif text-navy hover:text-gold transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-6 mt-8 text-gold">
            <a
              href="https://www.instagram.com/_inderpushp?exln=Z2tuNXNwOXZ5Ym40"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @_inderpushp"
              className="hover:opacity-80 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
