"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MessageCircle,
  MapPin,
  ArrowUp,
  Heart,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#1E2738] text-[#FAF7F0] border-t border-[#B79A5A]/25 relative overflow-hidden">
      {/* Decorative Golden Accent Stripe */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#B79A5A]/60 to-transparent" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#FAF7F0]/10 items-start">
          
          {/* Column 1: Brand & Atelier Story (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative w-[145px] sm:w-[165px] h-[40px] sm:h-[46px] bg-[#FAF7F0] rounded-lg p-1.5 border border-[#B79A5A]/30 shadow-xs transition-transform group-hover:scale-[1.02]">
                <Image
                  src="/logo.png"
                  alt="InderPushp House of Art"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm font-sans text-[#FAF7F0]/80 leading-relaxed font-light max-w-sm">
              I hand-cut and piece together every mosaic in my studio, using fine stained and mirrored glass. Each artwork takes time, patience, and care — made to bring a touch of quiet warmth and beauty into your home.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] font-sans text-[#D8C594] font-medium tracking-wider uppercase">
              <Sparkles size={13} className="text-[#B79A5A]" />
              <span>Handcrafted by Geetu Jaidka &bull; India</span>
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#D8C594] font-semibold block">
              Explore
            </span>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              <li>
                <Link
                  href="/"
                  className="text-[#FAF7F0]/75 hover:text-[#D8C594] transition-colors inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#collections"
                  className="text-[#FAF7F0]/75 hover:text-[#D8C594] transition-colors inline-block"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#FAF7F0]/75 hover:text-[#D8C594] transition-colors inline-block"
                >
                  About the Artist
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-[#FAF7F0]/75 hover:text-[#D8C594] transition-colors inline-block"
                >
                  Contact & Commissions
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-[#FAF7F0]/75 hover:text-[#D8C594] transition-colors inline-block"
                >
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Direct Atelier Contact (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#D8C594] font-semibold block">
              Atelier Contact
            </span>
            <ul className="space-y-3 text-xs sm:text-sm font-sans text-[#FAF7F0]/80">
              <li>
                <a
                  href="https://wa.me/919911145052?text=Hello%20Geetu,%20I%20am%20interested%20in%20Inderpushp%20mosaic%20artworks."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-[#D8C594] transition-colors"
                >
                  <MessageCircle size={15} className="text-[#B79A5A] shrink-0" />
                  <span>+91 99111 45052</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:inderpushphouseofart@yahoo.com"
                  className="group flex items-center gap-2.5 hover:text-[#D8C594] transition-colors break-all"
                >
                  <Mail size={15} className="text-[#B79A5A] shrink-0" />
                  <span>inderpushphouseofart@yahoo.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/_inderpushp?exln=Z2tuNXNwOXZ5Ym40"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-[#D8C594] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#B79A5A] shrink-0"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>@_inderpushp</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[#FAF7F0]/65">
                <MapPin size={15} className="text-[#B79A5A] shrink-0" />
                <span>Pan-India Safe Art Delivery</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Personal Quote & Back to Top (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col justify-between items-start lg:items-end space-y-4">
            <div className="lg:text-right">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B79A5A] font-semibold block mb-1">
                Artist Statement
              </span>
              <p className="font-serif italic text-xs sm:text-sm text-[#FAF7F0]/80 leading-relaxed">
                &ldquo;Small pieces. Larger meanings.&rdquo;
              </p>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              type="button"
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#263248] hover:bg-[#B79A5A] text-[#FAF7F0] text-xs font-sans font-medium transition-all duration-300 border border-[#B79A5A]/30 cursor-pointer group shadow-sm active:scale-95"
            >
              <span>Back to Top</span>
              <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Designer credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-sans text-[#FAF7F0]/50">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Inderpushp House of Art. All rights reserved. Artist Geetu Jaidka.
          </p>
          <div className="flex items-center gap-1.5 text-center sm:text-right">
            <span>Handcrafted with precision &amp; care</span>
            <Heart size={11} className="text-[#B79A5A] fill-[#B79A5A]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
