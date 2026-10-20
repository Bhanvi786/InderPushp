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
        videoRef.current.play().catch(() => { });
      }
    }
  };

  return (
    <section
      id="about-preview"
      className="relative w-full bg-gradient-to-l from-[#050A12] via-[#111C2E] to-[#263857] border-t border-[#B79A5A]/30 overflow-hidden text-[#FAF7F0]"
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
        <div className="flex-1 min-w-0 py-8 xs:py-10 sm:py-14 md:py-16 lg:py-20 pl-4 xs:pl-5 sm:pl-8 md:pl-12 lg:pl-16 pr-3 xs:pr-4 sm:pr-6 md:pr-8 flex flex-col justify-center relative bg-transparent">

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

          <div className="w-full max-w-5xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-12 lg:gap-14 items-center">

              {/* Artwork / Video: Proportional container that fits the full video without cutting top/bottom */}
              <div className="md:col-span-5 flex justify-center md:justify-start min-w-0 w-full">
                <div className="w-full max-w-[240px] xs:max-w-[270px] sm:max-w-[320px] md:max-w-[370px]">
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

              {/* Story Content: Wraps comfortably inside the available width, shifted to the right */}
              <div className="md:col-span-7 flex flex-col justify-center min-w-0 md:pl-4 lg:pl-8">
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
              src="/borders.png"
              alt="Handcrafted Mosaic Ribbon Border"
              fill
              className="object-contain object-right"
              sizes="(max-width: 640px) 85px, (max-width: 768px) 130px, (max-width: 1024px) 190px, 320px"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}
