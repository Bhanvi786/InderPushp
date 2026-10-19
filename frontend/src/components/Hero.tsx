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
    "/2.jpeg", // 10: Right Small Gold (Small tile with curved top-left)
    "/3.jpeg", // 11: Right Peacock (Tall rectangle on the middle right)
    "/4.jpeg", // 12: Bottom Right Green Leaves (Bottom right, curved top-left)
  ];

  return (
    <section className="relative w-full h-auto md:h-[100dvh] md:min-h-0 md:max-h-[100dvh] pt-24 pb-8 md:pt-[70px] md:pb-0 flex items-center justify-center overflow-hidden bg-ivory">

      <div className="relative w-full max-w-[1500px] h-full mx-auto px-5 md:px-12 xl:px-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-16 xl:gap-24">

        {/* Subtle Editorial Bridge */}
        <div className="hidden md:block absolute left-[46%] xl:left-[45%] top-1/2 -translate-y-1/2 w-px h-[50vh] bg-gold-light opacity-30 pointer-events-none rounded-full"></div>

        {/* LEFT SIDE CONTENT & MOBILE 2-COLUMN HERO COMPOSITION */}
        <div className="w-full md:w-[44%] xl:w-[42%] z-10 animate-fade-up shrink-0 md:pl-16 lg:pl-32 xl:pl-40">

          {/* On mobile: 2-column flex with items-center so left and right groups share the exact vertical center */}
          {/* On desktop: single vertical column for text, with features placed below */}
          <div className="flex flex-row md:flex-col items-center md:items-start justify-between gap-4 xs:gap-5 md:gap-0">

            {/* LEFT SUB-COLUMN ON MOBILE: Text Content & CTA (Shifted further right on mobile) */}
            <div className="flex-1 min-w-0 flex flex-col items-start text-left pl-16 xs:pl-20 sm:pl-24 md:pl-0">
              {/* EYEBROW */}
              <div className="flex flex-col items-start mb-2 xs:mb-3 md:mb-10">
                <p className="text-gold tracking-[0.22em] xs:tracking-[0.25em] md:tracking-[0.28em] text-[10px] xs:text-[11px] md:text-[14px] font-medium uppercase">
                  Art <span className="mx-1 xs:mx-1.5 md:mx-2">·</span> Nature <span className="mx-1 xs:mx-1.5 md:mx-2">·</span> Spaces
                </p>
              </div>

              {/* MAIN HEADING */}
              <h1 className="text-[28px] xs:text-[32px] sm:text-[40px] md:text-[50px] lg:text-[54px] xl:text-[60px] font-serif text-navy leading-[1.08] xs:leading-[1.12] md:leading-[1.15] tracking-[-0.02em] mb-2.5 xs:mb-3.5 md:mb-12">
                MOSAICS<br />
                THAT TELL<br />
                <span className="text-gold italic pr-2 sm:pr-4">STORIES</span>
              </h1>

              {/* DESCRIPTION */}
              <p className="text-text-muted text-[12.5px] xs:text-[13.5px] sm:text-[15px] md:text-[17px] lg:text-[18px] font-sans font-normal max-w-[340px] sm:max-w-[500px] mb-3.5 xs:mb-4.5 md:mb-14 leading-[1.5] xs:leading-[1.6] md:leading-[1.8]">
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
                className="group relative inline-flex items-center justify-center gap-3 bg-[#B79A5A] hover:bg-[#263248] text-white w-full max-w-[210px] xs:max-w-[240px] sm:max-w-[280px] md:w-[320px] h-[42px] xs:h-[46px] sm:h-[50px] md:h-[56px] transition-all duration-300 rounded-full shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer px-6 overflow-hidden border border-[#B79A5A]/30"
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

            {/* RIGHT SUB-COLUMN ON MOBILE: Vertical Feature Highlights */}
            {/* On desktop: Shifts below as the standard horizontal 3-column row */}
            <div className="shrink-0 w-[95px] xs:w-[110px] sm:w-[125px] md:w-full md:max-w-[500px] flex flex-col md:grid md:grid-cols-3 gap-3.5 xs:gap-4 md:gap-0 pl-3 xs:pl-4 md:pl-0 border-l md:border-l-0 md:border-t border-gold-light/40 md:mt-10 md:pt-8 py-1.5 self-center">

              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center gap-1.5 xs:gap-2 md:gap-3.5 relative">
                <Heart size={20} className="text-gold xs:w-[22px] xs:h-[22px] md:w-[28px] md:h-[28px]" strokeWidth={1.2} />
                <p className="text-[9.5px] xs:text-[10px] md:text-[11px] lg:text-[12px] text-navy font-sans font-medium uppercase tracking-[0.16em] xs:tracking-[0.18em] md:tracking-[0.2em] leading-tight md:leading-relaxed">
                  Handcrafted<br />with Love
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center gap-1.5 xs:gap-2 md:gap-3.5 relative">
                {/* Vertical Divider on Desktop only */}
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-[50px] bg-gold-light opacity-50 pointer-events-none"></div>
                <Leaf size={20} className="text-gold xs:w-[22px] xs:h-[22px] md:w-[28px] md:h-[28px]" strokeWidth={1.2} />
                <p className="text-[9.5px] xs:text-[10px] md:text-[11px] lg:text-[12px] text-navy font-sans font-medium uppercase tracking-[0.16em] xs:tracking-[0.18em] md:tracking-[0.2em] leading-tight md:leading-relaxed">
                  Inspired<br />by Nature
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center gap-1.5 xs:gap-2 md:gap-3.5 relative">
                {/* Vertical Divider on Desktop only */}
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-[50px] bg-gold-light opacity-50 pointer-events-none"></div>
                <Home size={20} className="text-gold xs:w-[22px] xs:h-[22px] md:w-[28px] md:h-[28px]" strokeWidth={1.2} />
                <p className="text-[9.5px] xs:text-[10px] md:text-[11px] lg:text-[12px] text-navy font-sans font-medium uppercase tracking-[0.16em] xs:tracking-[0.18em] md:tracking-[0.2em] leading-tight md:leading-relaxed">
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
