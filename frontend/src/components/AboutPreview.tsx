"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

export default function AboutPreview() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <section
      id="about-preview"
      className="relative w-full bg-[#1b2332] border-t border-[#B79A5A]/30 overflow-hidden text-[#FAF7F0]"
    >
      {/* ========================================================================= */}
      {/* 2-ZONE FLEXIBLE LAYOUT:                                                   */}
      {/* Zone A (Left): Story content & artwork, adapting to all available width    */}
      {/* Zone B (Right): Full dedicated flowing mosaic ribbon from top to bottom   */}
      {/* ========================================================================= */}
      <div className="w-full flex flex-row items-stretch relative">

        {/* ----------------------------------------------------------------------- */}
        {/* LEFT AREA: Content Column with Rich Layered Artistic Background         */}
        {/* Takes all remaining space, min-w-0 prevents any horizontal blowouts     */}
        {/* ----------------------------------------------------------------------- */}
        <div className="flex-1 min-w-0 py-8 xs:py-10 sm:py-14 md:py-16 lg:py-20 pl-4 xs:pl-5 sm:pl-8 md:pl-12 lg:pl-16 pr-3 xs:pr-4 sm:pr-6 md:pr-8 flex flex-col justify-center relative bg-gradient-to-br from-[#1d2638] via-[#222e44] to-[#18202f]">
          
          {/* Subtle Ambient Gold Lighting at top-left corner */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D8C594]/8 blur-3xl pointer-events-none"
          />

          {/* Faint Handcrafted Mosaic Stone / Plaster Stippling Texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#FAF7F0_1px,transparent_1px)] [background-size:16px_16px]"
          />

          {/* Delicate Geometric Mosaic Outlines (Handcrafted Tesserae Motifs, away from text) */}
          <svg
            aria-hidden="true"
            className="absolute bottom-3 left-4 w-32 h-32 text-[#D8C594]/10 pointer-events-none stroke-current fill-none stroke-[0.8]"
            viewBox="0 0 100 100"
          >
            {/* Artistic interlocking mosaic tile outlines */}
            <polygon points="10,20 30,12 38,32 18,38" />
            <polygon points="40,32 60,25 68,44 48,50" />
            <polygon points="18,42 38,36 32,58 12,62" />
            <polygon points="34,60 54,54 48,76 28,80" />
          </svg>

          {/* Soft Gold Undertone glow along bottom edge */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#D8C594]/[0.03] to-transparent pointer-events-none"
          />

          {/* ========================================================================= */}
          {/* ORGANIC S-CURVE TRANSITION: Gold Glow & Scattered Tesserae Fragments      */}
          {/* Blends the deep navy canvas into the mosaic ribbon seamlessly             */}
          {/* ========================================================================= */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 right-0 w-16 xs:w-20 sm:w-28 md:w-36 pointer-events-none z-1 overflow-hidden select-none"
          >
            {/* Soft, flowing antique gold aura along the boundary */}
            <div className="absolute inset-0 bg-gradient-to-l from-[#D8C594]/12 via-[#D8C594]/[0.04] to-transparent" />

            {/* S-shaped flowing gold curve line and dissolving gold mosaic tesserae */}
            <svg
              className="absolute inset-0 w-full h-full text-[#D8C594]"
              viewBox="0 0 100 800"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="goldCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D8C594" stopOpacity="0.45" />
                  <stop offset="25%" stopColor="#FAF7F0" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#D8C594" stopOpacity="0.5" />
                  <stop offset="75%" stopColor="#B79A5A" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#D8C594" stopOpacity="0.45" />
                </linearGradient>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Glowing fluid S-curve contour along the junction */}
              <path
                d="M 98,0 C 65,140 35,260 70,400 C 100,530 60,670 98,800"
                stroke="url(#goldCurveGrad)"
                strokeWidth="2.5"
                filter="url(#goldGlow)"
              />
              <path
                d="M 98,0 C 65,140 35,260 70,400 C 100,530 60,670 98,800"
                stroke="#FAF7F0"
                strokeWidth="0.8"
                strokeOpacity="0.6"
              />

              {/* Scattered artisanal golden tesserae (mosaic fragments dissolving into navy) */}
              {/* Cluster 1 - Upper curve */}
              <polygon points="58,110 68,106 72,118 62,122" fill="#D8C594" fillOpacity="0.35" stroke="#FAF7F0" strokeWidth="0.5" strokeOpacity="0.4" />
              <polygon points="44,145 52,141 55,151 47,155" fill="#FAF7F0" fillOpacity="0.3" stroke="#D8C594" strokeWidth="0.5" strokeOpacity="0.3" />
              <polygon points="32,185 39,182 41,190 34,193" fill="#D8C594" fillOpacity="0.4" stroke="#D8C594" strokeWidth="0.4" strokeOpacity="0.5" />
              <polygon points="48,220 56,216 59,226 51,230" fill="#B79A5A" fillOpacity="0.35" stroke="#FAF7F0" strokeWidth="0.5" strokeOpacity="0.4" />

              {/* Cluster 2 - Mid curve (inward sweep) */}
              <polygon points="62,370 72,365 76,377 66,382" fill="#D8C594" fillOpacity="0.45" stroke="#FAF7F0" strokeWidth="0.5" strokeOpacity="0.5" />
              <polygon points="50,405 58,401 61,411 53,415" fill="#FAF7F0" fillOpacity="0.3" stroke="#D8C594" strokeWidth="0.4" strokeOpacity="0.4" />
              <polygon points="68,445 76,440 80,450 72,455" fill="#B79A5A" fillOpacity="0.4" stroke="#FAF7F0" strokeWidth="0.5" strokeOpacity="0.4" />

              {/* Cluster 3 - Lower curve */}
              <polygon points="48,620 56,616 59,626 51,630" fill="#D8C594" fillOpacity="0.4" stroke="#FAF7F0" strokeWidth="0.5" strokeOpacity="0.4" />
              <polygon points="36,660 44,656 47,666 39,670" fill="#FAF7F0" fillOpacity="0.3" stroke="#D8C594" strokeWidth="0.4" strokeOpacity="0.4" />
              <polygon points="58,710 68,705 72,717 62,722" fill="#B79A5A" fillOpacity="0.35" stroke="#FAF7F0" strokeWidth="0.5" strokeOpacity="0.4" />
            </svg>
          </div>

          <div className="w-full max-w-4xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-center">

              {/* Artwork / Video: Proportional container that fits the full video without cutting top/bottom */}
              <div className="md:col-span-5 flex justify-center md:justify-start min-w-0 w-full">
                <div className="w-full max-w-[205px] xs:max-w-[230px] sm:max-w-[270px] md:max-w-[310px]">
                  <div className="relative aspect-[9/14] sm:aspect-[9/14] md:aspect-4/5 w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-[#D8C594]/45 bg-[#1b2332] group">
                    <video
                      ref={videoRef}
                      src="/artist.MP4"
                      poster="/artist.png"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-contain cursor-pointer"
                      onClick={toggleSound}
                    />

                    {/* Subtle warm golden gloss overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

                    {/* Elegant Sound Toggle Button */}
                    <button
                      type="button"
                      onClick={toggleSound}
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                      className="absolute bottom-2.5 right-2.5 xs:bottom-3 xs:right-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-[#D8C594]/60 text-[#FAF7F0] text-[10px] xs:text-[11px] font-sans font-medium transition-all shadow-lg active:scale-95"
                    >
                      {isMuted ? (
                        <>
                          <VolumeX size={13} className="text-[#D8C594]" />
                          <span>Sound On</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={13} className="text-[#D8C594] animate-pulse" />
                          <span>Mute</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Story Content: Wraps comfortably inside the available width */}
              <div className="md:col-span-7 flex flex-col justify-center min-w-0">
                {/* Small Eyebrow Label */}
                <span className="text-[9.5px] xs:text-[10.5px] sm:text-[11px] font-sans tracking-[0.2em] xs:tracking-[0.24em] uppercase text-[#D8C594] font-semibold mb-1.5 sm:mb-2 block">
                  The Story Behind The Art
                </span>

                {/* Heading: Fluid clamp typography, wrapping into multiple lines naturally */}
                <h2 className="text-[clamp(1.15rem,4.4vw,2.15rem)] font-serif text-[#FAF7F0] tracking-tight font-medium leading-[1.24] mb-2.5 xs:mb-3.5 sm:mb-4 break-words">
                  A Story That Began With a Name
                </h2>

                {/* Paragraphs: Fully constrained to left column width */}
                <div className="space-y-2 xs:space-y-2.5 sm:space-y-3.5 text-[12px] xs:text-[13.5px] sm:text-base font-sans text-[#FAF7F0]/90 leading-relaxed font-light mb-3.5 xs:mb-4.5 sm:mb-5">
                  <p className="break-words">
                    Inderpushp brings together the names of my parents, Inderpal and Pushpa — a tribute to the roots that have shaped me and the values I hold close.
                  </p>
                  <p className="break-words">
                    What began as a personal expression of love has grown into Inderpushp House of Art, a space where creativity, colour and little pieces come together to tell beautiful stories.
                  </p>
                </div>

                {/* Attribution: Founder & Artist */}
                <div className="pt-0.5 pb-2.5 xs:pb-3 sm:pb-4 mb-3 xs:mb-4 border-b border-[#D8C594]/30 flex flex-col gap-0.5">
                  <h4 className="text-xs xs:text-sm sm:text-base font-serif font-semibold text-[#FAF7F0]">
                    Geetu Jaidka
                  </h4>
                  <p className="text-[10px] xs:text-[11px] sm:text-xs font-sans text-[#D8C594] tracking-wider uppercase font-medium">
                    Founder & Artist
                  </p>
                </div>

                {/* Discover My Story Link */}
                <div>
                  <Link
                    href="/about"
                    className="group inline-flex items-center gap-2 py-1 text-[11px] xs:text-xs sm:text-sm font-sans uppercase tracking-wider text-[#FAF7F0] font-semibold hover:text-[#D8C594] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D8C594]"
                  >
                    <span>Discover My Story</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1 text-[#D8C594] shrink-0"
                    />
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT AREA: Dedicated Full Flowing Mosaic Ribbon                       */}
        {/* Preserves the complete S-curve from top to bottom at full prominence    */}
        {/* Has its own reserved width so content can NEVER touch or collide with it*/}
        {/* ----------------------------------------------------------------------- */}
        <div
          aria-hidden="true"
          className="shrink-0 w-[72px] xs:w-[85px] sm:w-[130px] md:w-[190px] lg:w-[260px] xl:w-[320px] relative self-stretch overflow-hidden select-none pointer-events-none"
        >
          <div className="relative w-full h-full min-h-[420px]">
            <Image
              src="/mosaic-wave-ribbon.jpg"
              alt="Handcrafted Mosaic Ribbon Border"
              fill
              className="object-cover object-right"
              sizes="(max-width: 640px) 85px, (max-width: 768px) 130px, (max-width: 1024px) 190px, 320px"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
