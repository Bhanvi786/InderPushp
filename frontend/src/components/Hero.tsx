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
    <section className="relative w-full h-auto min-h-screen md:h-[100dvh] md:min-h-0 md:max-h-[100dvh] pt-[90px] pb-12 md:pt-[70px] md:pb-0 flex items-center justify-center overflow-hidden bg-ivory">
      
      <div className="relative w-full max-w-[1500px] h-full mx-auto px-5 md:px-12 xl:px-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-8 lg:gap-16 xl:gap-24">
        
        {/* Subtle Editorial Bridge */}
        <div className="hidden md:block absolute left-[46%] xl:left-[45%] top-1/2 -translate-y-1/2 w-px h-[50vh] bg-gold-light opacity-30 pointer-events-none rounded-full"></div>

      {/* LEFT SIDE CONTENT */}
      <div className="w-full md:w-[44%] xl:w-[42%] flex flex-col items-center md:items-start text-center md:text-left z-10 animate-fade-up shrink-0 md:pl-16 lg:pl-32 xl:pl-40">

        {/* EYEBROW */}
        <div className="flex flex-col items-center md:items-start mb-10">
          <p className="text-gold tracking-[0.28em] text-[12px] md:text-[14px] font-medium uppercase">
            Art <span className="mx-2">·</span> Nature <span className="mx-2">·</span> Spaces
          </p>
        </div>

        {/* MAIN HEADING */}
        <h1 className="text-[42px] sm:text-[48px] md:text-[50px] lg:text-[54px] xl:text-[60px] font-serif text-navy leading-[1.15] tracking-[-0.02em] mb-12">
          MOSAICS<br />
          THAT TELL<br />
          <span className="text-gold italic pr-4">STORIES</span>
        </h1>

        {/* DESCRIPTION */}
        <p className="text-text-muted text-[15px] md:text-[17px] lg:text-[18px] font-sans font-normal max-w-[500px] mb-14 leading-[1.8]">
          Handcrafted mosaic art that brings<br className="hidden sm:block" />
          colour, texture and meaningful<br className="hidden sm:block" />
          stories into your spaces.
        </p>

        {/* CTA */}
        <button className="group flex items-center justify-center gap-3 bg-gold hover:bg-navy text-white w-[320px] h-[54px] transition-colors duration-300 rounded-[2px]">
          <span className="text-[13px] font-sans tracking-[0.18em] uppercase">Explore Collections</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>

        {/* Feature Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 mt-10 w-full max-w-[500px] border-t border-gold-light/40 pt-8">

          <div className="flex flex-col items-center text-center gap-3.5 relative">
            <Heart size={28} className="text-gold" strokeWidth={1} />
            <p className="text-[11px] lg:text-[12px] text-navy font-sans font-medium uppercase tracking-[0.2em] leading-relaxed">
              Handcrafted<br />with Love
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-3.5 relative">
            {/* Vertical Divider */}
            <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-[50px] bg-gold-light opacity-50 pointer-events-none"></div>
            <Leaf size={28} className="text-gold" strokeWidth={1} />
            <p className="text-[11px] lg:text-[12px] text-navy font-sans font-medium uppercase tracking-[0.2em] leading-relaxed">
              Inspired<br />by Nature
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-3.5 relative">
            {/* Vertical Divider */}
            <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-[50px] bg-gold-light opacity-50 pointer-events-none"></div>
            <Home size={28} className="text-gold" strokeWidth={1} />
            <p className="text-[11px] lg:text-[12px] text-navy font-sans font-medium uppercase tracking-[0.2em] leading-relaxed">
              Art for Homes,<br />Workspaces & More
            </p>
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
