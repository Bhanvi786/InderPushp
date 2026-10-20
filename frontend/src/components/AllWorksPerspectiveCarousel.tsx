"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Artwork } from "../types/artwork";
import { getImageKitUrl } from "../lib/imagekit";

/* ========================================================================= */
/* 3D CIRCULAR CAROUSEL CONFIGURATION: SPACING VS CURVATURE ARE INDEPENDENT  */
/* ========================================================================= */
export const DEFAULT_CAROUSEL_CONFIG = {
  desktop: {
    angleStep: 13,     // Arc curvature step (degrees per card)
    radius: 1220,      // Physical circular radius (spreads 7 cards edge-to-edge)
    perspective: 1350, // Depth perspective >= radius
    cardWidth: 245,
    cardHeight: 315,
  },
  tablet: {
    angleStep: 16,
    radius: 780,
    perspective: 900,
    cardWidth: 190,
    cardHeight: 245,
  },
  mobile: {
    angleStep: 17,     // Keeps the exact same multi-card curved arc visible on phones
    radius: 340,       // Proportionally scaled so cards wrap around mobile viewport
    perspective: 450,  // Proportional mobile camera perspective
    cardWidth: 132,    // Compact card size that comfortably fits mobile screens
    cardHeight: 172,
  },
};

interface AllWorksPerspectiveCarouselProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

export default function AllWorksPerspectiveCarousel({
  artworks,
  onArtworkClick,
}: AllWorksPerspectiveCarouselProps) {
  if (!artworks || artworks.length === 0) return null;

  return (
    // Clean full-width container without w-screen mobile scrollbar overflow
    <div className="relative w-full max-w-[100vw] overflow-hidden py-3 sm:py-8 select-none">
      {/* Warm ambient radial aura lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[850px] h-[300px] sm:h-[520px] bg-[#B79A5A]/[0.05] blur-[80px] sm:blur-[130px] rounded-full pointer-events-none z-0"
      />

      <div className="w-full relative z-10">
        <Circular3DCarouselTrack
          artworks={artworks}
          direction={-1}
          speed={0.00035} // Relaxed, luxurious gliding speed
          onArtworkClick={onArtworkClick}
        />
      </div>
    </div>
  );
}

interface Circular3DCarouselTrackProps {
  artworks: Artwork[];
  direction: 1 | -1;
  speed: number;
  onArtworkClick: (artwork: Artwork) => void;
}

function Circular3DCarouselTrack({
  artworks,
  direction,
  speed,
  onArtworkClick,
}: Circular3DCarouselTrackProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Drag / Swipe / Velocity Inertia State
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartIndexRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const lastDragXRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Continuous activeIndex (float) drives rotation smoothly
  const activeIndexRef = useRef(0);

  // Duplicate items into a 24-card continuous loop
  const items = useMemo(() => {
    let list = [...artworks];
    while (list.length < 24) {
      list = [...list, ...artworks];
    }
    return list.slice(0, 24);
  }, [artworks]);

  const totalCards = items.length;

  // Responsive config state derived from DEFAULT_CAROUSEL_CONFIG
  const [config, setConfig] = useState(DEFAULT_CAROUSEL_CONFIG.desktop);

  const updateResponsive = useCallback(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1440;
    if (w < 640) {
      setConfig(DEFAULT_CAROUSEL_CONFIG.mobile);
    } else if (w < 1100) {
      setConfig(DEFAULT_CAROUSEL_CONFIG.tablet);
    } else {
      setConfig(DEFAULT_CAROUSEL_CONFIG.desktop);
    }
  }, []);

  useEffect(() => {
    updateResponsive();
    window.addEventListener("resize", updateResponsive);
    return () => window.removeEventListener("resize", updateResponsive);
  }, [updateResponsive]);

  // Smooth step navigation helper (for arrow buttons)
  const stepSlide = (step: number) => {
    const target = Math.round(activeIndexRef.current) + step;
    const startTime = performance.now();
    const startVal = activeIndexRef.current;
    const change = target - startVal;
    const duration = 450; // ms

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const stepAnim = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      activeIndexRef.current = startVal + change * easeOutCubic(progress);
      if (progress < 1) {
        requestAnimationFrame(stepAnim);
      }
    };
    requestAnimationFrame(stepAnim);
  };

  // 60FPS / 120FPS Direct GPU DOM Loop with Circular Trigonometric Placement
  useEffect(() => {
    let reqId: number;
    let lastTime = performance.now();

    const { angleStep, radius } = config;
    const degToRad = Math.PI / 180;

    const frameLoop = (now: number) => {
      const dt = Math.min(now - lastTime, 40);
      lastTime = now;

      // Inertia decay after flick/drag release
      if (!isDraggingRef.current && Math.abs(dragVelocityRef.current) > 0.00005) {
        activeIndexRef.current += dragVelocityRef.current * dt;
        dragVelocityRef.current *= 0.94; // friction
      } else if (!isHoveredRef.current && !isDraggingRef.current) {
        // Autoplay: continuously advances activeIndex smoothly
        activeIndexRef.current += direction * speed * dt;
      }

      // Keep activeIndex normalized within [0, totalCards)
      const normalizedActiveIndex =
        ((activeIndexRef.current % totalCards) + totalCards) % totalCards;

      cardElementsRef.current.forEach((el, index) => {
        if (!el) return;

        // Circular offset = index - activeIndex (wrapped to [-totalCards/2, totalCards/2])
        let offset = (index - normalizedActiveIndex) % totalCards;
        if (offset < -totalCards / 2) offset += totalCards;
        if (offset > totalCards / 2) offset -= totalCards;

        // Culling: keep elements rendered in DOM so images stay fully decoded in mobile GPU memory
        const absOffset = Math.abs(offset);
        if (absOffset > 5.5) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.style.visibility = "hidden";
          return;
        }

        el.style.visibility = "visible";
        el.style.pointerEvents = "auto";

        /* ========================================================================= */
        /* EXACT CIRCULAR (TRIGONOMETRIC) PLACEMENT FORMULAS                         */
        /* ========================================================================= */
        const angleDeg = offset * angleStep;
        const angleRad = angleDeg * degToRad;

        const x = Math.sin(angleRad) * radius;
        const z = (Math.cos(angleRad) - 1) * radius;
        const rotateY = -offset * angleStep; // concave arc: right cards face left, left cards face right

        // Perspective in 3D already gives natural foreshortening and depth scaling via z.
        // Keeping scale uniform at 1.0 eliminates any artificial stretching/inflating/extending illusion.
        const brightness = 0.76 + 0.24 * Math.cos(angleRad);

        // Smooth fade at the extreme outer edges (between 3.8 and 5.5) so cards glide in invisibly
        let opacity = 1;
        if (absOffset > 3.8) {
          opacity = Math.max(0, 1 - (absOffset - 3.8) / 1.7);
        }

        // WebKit depth ordering: front-most card (offset close to 0) has highest z-index
        const zIndexVal = Math.round(2000 - Math.abs(offset) * 200 + z);

        el.style.opacity = `${opacity.toFixed(3)}`;
        el.style.transform = `translate3d(${x.toFixed(2)}px, 0px, ${z.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg)`;
        el.style.zIndex = `${zIndexVal}`;
        el.style.filter = `brightness(${brightness.toFixed(3)})`;
      });

      reqId = requestAnimationFrame(frameLoop);
    };

    reqId = requestAnimationFrame(frameLoop);
    return () => cancelAnimationFrame(reqId);
  }, [direction, speed, totalCards, config]);

  // Touch and Mouse Drag / Swipe Handlers with Velocity Inertia
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = performance.now();
    dragStartIndexRef.current = activeIndexRef.current;
    dragDistanceRef.current = 0;
    dragVelocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const deltaX = e.clientX - dragStartXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);

    const pixelPerCard = config.cardWidth + 12;
    activeIndexRef.current = dragStartIndexRef.current - deltaX / pixelPerCard;

    // Track instant velocity
    const timeDelta = Math.max(now - lastDragTimeRef.current, 1);
    const posDelta = e.clientX - lastDragXRef.current;
    dragVelocityRef.current = -(posDelta / pixelPerCard) / timeDelta;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Preload all carousel images into memory so they are instantly ready with zero pop-in on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;
    items.forEach((art) => {
      const url = getImageKitUrl(art.mainImage?.url, {
        width: 650,
        quality: 85,
        format: "webp",
      });
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }, [items]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y group/carousel"
      style={{
        height: `${config.cardHeight + 56}px`,
        perspective: `${config.perspective}px`,
        perspectiveOrigin: "50% 50%",
      }}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        isDraggingRef.current = false;
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Sleek Floating Arrow Controls (fade in gently on hover) */}
      <button
        type="button"
        aria-label="Previous artwork"
        onClick={(e) => {
          e.stopPropagation();
          stepSlide(1);
        }}
        className="absolute left-4 sm:left-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAF7F0]/90 hover:bg-[#FAF7F0] border border-[#B79A5A]/50 text-[#263248] shadow-lg flex items-center justify-center transition-all duration-300 opacity-0 group-hover/carousel:opacity-90 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
      >
        <ChevronLeft size={20} className="text-[#263248]" />
      </button>

      <button
        type="button"
        aria-label="Next artwork"
        onClick={(e) => {
          e.stopPropagation();
          stepSlide(-1);
        }}
        className="absolute right-4 sm:right-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAF7F0]/90 hover:bg-[#FAF7F0] border border-[#B79A5A]/50 text-[#263248] shadow-lg flex items-center justify-center transition-all duration-300 opacity-0 group-hover/carousel:opacity-90 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
      >
        <ChevronRight size={20} className="text-[#263248]" />
      </button>

      {/* 3D Curved Circular Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((art, index) => {
          const imageUrl = getImageKitUrl(art.mainImage?.url, {
            width: 650,
            quality: 85,
            format: "webp",
          });

          return (
            <div
              key={`card-${art._id}-${index}`}
              ref={(el) => {
                cardElementsRef.current[index] = el;
              }}
              onClick={() => {
                if (dragDistanceRef.current < 6) {
                  onArtworkClick(art);
                }
              }}
              className="absolute cursor-pointer will-change-transform group pointer-events-auto"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {/* ULTRA-LUXURY MOSAIC ARTWORK CANVAS */}
              <div
                className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] bg-[#EFE9DD] flex items-center justify-center border border-[#B79A5A]/45 shadow-[0_20px_50px_-10px_rgba(20,28,45,0.4)] group-hover:border-[#D8C594] group-hover:shadow-[0_28px_65px_-8px_rgba(183,154,90,0.58)]"
                style={{
                  width: `${config.cardWidth}px`,
                  height: `${config.cardHeight}px`,
                }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={art.mainImage?.alt || art.title || "Mosaic Artwork"}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#B79A5A]/40 font-serif text-sm">
                    InderPushp
                  </div>
                )}

                {/* Fine Gold Inner Bevel */}
                <div className="absolute inset-0 rounded-[22px] sm:rounded-[28px] ring-1 ring-inset ring-white/30 pointer-events-none" />

                {/* Ambient Mosaic Luster Glaze Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/18 via-transparent to-white/20 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
