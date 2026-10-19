"use client";
import React from "react";
import MosaicGallery from "./MosaicGallery";
import { Heart, Leaf, Home } from "lucide-react";

export default function Hero() {
  const images = [
    "/2.jpeg", // 0: Left Arch (Tall vertical, curved top-left)
    "/3.jpeg", // 1: Left Blue Curve (Bottom left, curved top-left)
    "/4.jpeg", // 2: Bottom Left Beige (Small rectangle)
    "/5.jpeg", // 3: Small Top Red (Small rectangle above Lotus)
    "/6.png", // 4: Top Left Filler (Hidden behind left side of Lotus)
    "/7.jpg",  // 5: Top Beige Leaves (Hidden behind right side of Lotus)
    "/1.jpeg", // 6: Center Lotus (Main central focal point, large top semi-circle)
    "/8.jpeg", // 7: Bottom Middle Brown (Small vertical rectangle under Lotus)
    "/9.jpeg", // 8: Bottom Middle Green Curve (Bottom middle, curved top-left)
    "/10.jpeg", // 9: Top Right Flower (Tall rectangle on the top right)
    "/13.png", // 10: Right Lion circular/curved tile (Curved top-left)
    "/11.jpg", // 11: Right bottom tile (Elongated)
    "/12.jpg", // 12: Bottom Right curved tile (Curved top-left)
  ];

  return (
    <section className="relative w-full h-auto md:h-[100dvh] md:min-h-0 md:max-h-[100dvh] pt-24 pb-8 md:pt-[70px] md:pb-0 flex items-center justify-center overflow-hidden bg-ivory">

      <div className="relative w-full max-w-[1500px] h-full mx-auto px-5 md:px-12 xl:px-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-16 xl:gap-24">

        {/* Subtle Editorial Bridge */}
        <div className="hidden md:block absolute left-[46%] xl:left-[45%] top-1/2 -translate-y-1/2 w-px h-[50vh] bg-gold-light opacity-30 pointer-events-none rounded-full"></div>

        {/* LEFT SIDE CONTENT & MOBILE 2-COLUMN HERO COMPOSITION */}
        <div className="w-full md:w-[50%] lg:w-[46%] xl:w-[42%] z-10 animate-fade-up shrink-0 md:pl-4 lg:pl-16 xl:pl-28">

          {/* On mobile (<md): 2-column flex side-by-side with vertical feature column on right */}
          {/* On desktop (>=md): Single vertical column for content, with horizontal 3-column features row below */}
          <div className="flex flex-row md:flex-col items-center md:items-start justify-between gap-3 xs:gap-4 md:gap-0">

            {/* LEFT SUB-COLUMN ON MOBILE: Text Content & CTA */}
            <div className="flex-1 min-w-0 flex flex-col items-start text-left pl-2 xs:pl-4 sm:pl-8 md:pl-0">
              {/* EYEBROW */}
              <div className="flex flex-col items-start mb-2 xs:mb-3 md:mb-5 lg:mb-8">
                <p className="text-gold tracking-[0.22em] xs:tracking-[0.25em] md:tracking-[0.28em] text-[10px] xs:text-[11px] md:text-[13px] lg:text-[14px] font-medium uppercase">
                  Art <span className="mx-1 xs:mx-1.5 md:mx-2">·</span> Nature <span className="mx-1 xs:mx-1.5 md:mx-2">·</span> Spaces
                </p>
              </div>

              {/* MAIN HEADING */}
              <h1 className="text-[28px] xs:text-[32px] sm:text-[40px] md:text-[44px] lg:text-[52px] xl:text-[60px] font-serif text-navy leading-[1.08] xs:leading-[1.12] md:leading-[1.14] tracking-[-0.02em] mb-2.5 xs:mb-3.5 md:mb-5 lg:mb-8">
                MOSAICS<br />
                THAT TELL<br />
                <span className="text-gold italic pr-2 sm:pr-4">STORIES</span>
              </h1>

              {/* DESCRIPTION */}
              <p className="text-text-muted text-[12.5px] xs:text-[13.5px] sm:text-[15px] md:text-[15.5px] lg:text-[17px] xl:text-[18px] font-sans font-normal max-w-[340px] sm:max-w-[480px] mb-3.5 xs:mb-4.5 md:mb-6 lg:mb-9 leading-[1.5] xs:leading-[1.6] md:leading-[1.7]">
                Handcrafted mosaic art that brings colour, texture and meaningful stories into your spaces.
              </p>

              {/* CTA */}
              <a
                href="#collections"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("collections");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="group relative inline-flex items-center justify-center gap-3 bg-[#B79A5A] hover:bg-[#263248] text-white w-full max-w-[210px] xs:max-w-[240px] sm:max-w-[280px] md:w-[300px] lg:w-[320px] h-[42px] xs:h-[46px] sm:h-[48px] md:h-[52px] lg:h-[56px] transition-all duration-300 rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer px-6 overflow-hidden border border-[#B79A5A]/30"
              >
                {/* Subtle sheen highlight on hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
                <span className="text-[11px] xs:text-[12px] md:text-[13px] font-sans tracking-[0.18em] xs:tracking-[0.2em] uppercase font-semibold text-[#FAF7F0]">
                  Explore Collections
                </span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-300 text-sm md:text-base font-light text-[#FAF7F0]">
                  →
                </span>
              </a>
            </div>

            {/* FEATURE HIGHLIGHTS: */}
            {/* On mobile (<md): Positioned vertically on the right side */}
            {/* On all desktop/laptop (>=md): Always visible horizontally in a clean 3-column row below CTA */}
            <div className="shrink-0 w-[115px] xs:w-[130px] sm:w-[150px] md:w-full md:max-w-[480px] lg:max-w-[520px] flex flex-col md:grid md:grid-cols-3 gap-3.5 xs:gap-4 md:gap-2 lg:gap-3 pl-3 xs:pl-3.5 md:pl-0 border-l md:border-l-0 md:border-t border-[#B79A5A]/35 md:mt-6 lg:mt-8 md:pt-4 lg:pt-6 py-2 md:py-0 self-center md:self-start">

              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center gap-1.5 xs:gap-2 md:gap-2 relative px-1">
                <Heart size={22} className="text-[#B79A5A] xs:w-[24px] xs:h-[24px] md:w-[26px] md:h-[26px] lg:w-[28px] lg:h-[28px] shrink-0" strokeWidth={1.5} />
                <p className="text-[10px] xs:text-[11px] sm:text-[11.5px] md:text-[11.5px] lg:text-[12.5px] text-[#263248] font-sans font-semibold uppercase tracking-[0.14em] xs:tracking-[0.16em] md:tracking-[0.16em] leading-snug">
                  Handcrafted<br />with Love
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center gap-1.5 xs:gap-2 md:gap-2 relative px-1">
                {/* Vertical Divider on Desktop */}
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-[36px] lg:h-[44px] bg-[#B79A5A]/35 pointer-events-none" />
                <Leaf size={22} className="text-[#B79A5A] xs:w-[24px] xs:h-[24px] md:w-[26px] md:h-[26px] lg:w-[28px] lg:h-[28px] shrink-0" strokeWidth={1.5} />
                <p className="text-[10px] xs:text-[11px] sm:text-[11.5px] md:text-[11.5px] lg:text-[12.5px] text-[#263248] font-sans font-semibold uppercase tracking-[0.14em] xs:tracking-[0.16em] md:tracking-[0.16em] leading-snug">
                  Inspired<br />by Nature
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center gap-1.5 xs:gap-2 md:gap-2 relative px-1">
                {/* Vertical Divider on Desktop */}
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-[36px] lg:h-[44px] bg-[#B79A5A]/35 pointer-events-none" />
                <Home size={22} className="text-[#B79A5A] xs:w-[24px] xs:h-[24px] md:w-[26px] md:h-[26px] lg:w-[28px] lg:h-[28px] shrink-0" strokeWidth={1.5} />
                <p className="text-[10px] xs:text-[11px] sm:text-[11.5px] md:text-[11.5px] lg:text-[12.5px] text-[#263248] font-sans font-semibold uppercase tracking-[0.14em] xs:tracking-[0.16em] md:tracking-[0.16em] leading-snug">
                  Art for<br />Homes
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE MOSAIC COMPOSITION */}
        <div className="w-full md:w-[56%] xl:w-[58%] h-auto md:h-full z-10 animate-fade-up delay-200 py-0 md:py-12 flex items-center justify-center md:justify-start">
          <MosaicGallery images={images} />
        </div>

      </div>
    </section>
  );
}
