"use client";

import React from "react";

interface MosaicBorderDividerProps {
  className?: string;
}

export default function MosaicBorderDivider({
  className = "",
}: MosaicBorderDividerProps) {
  /*
    Full-width edge-to-edge (0 to 1920) very thin, graceful wavy mosaic ribbon.
    Ribbon thickness is slender (~34px), undulating across the entire screen from left to right.
  */
  return (
    <div
      role="separator"
      aria-label="Handcrafted Flowing Mosaic Wave Border"
      className={`relative w-full overflow-hidden select-none pointer-events-none py-1 sm:py-2 ${className}`}
    >
      <div className="w-full">
        <svg
          viewBox="0 0 1920 80"
          className="w-full h-[32px] sm:h-[40px] md:h-[48px] lg:h-[54px] drop-shadow-[0_4px_12px_rgba(38,50,72,0.14)]"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Rich artisanal gold gradients */}
            <linearGradient id="goldSheenThin" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8A6E30" stopOpacity="0.85" />
              <stop offset="20%" stopColor="#B79A5A" stopOpacity="1" />
              <stop offset="40%" stopColor="#EADBB5" stopOpacity="1" />
              <stop offset="60%" stopColor="#B79A5A" stopOpacity="1" />
              <stop offset="80%" stopColor="#EADBB5" stopOpacity="1" />
              <stop offset="100%" stopColor="#8A6E30" stopOpacity="0.85" />
            </linearGradient>

            {/* Seamless continuous wavy ribbon pattern */}
            <pattern
              id="thinMosaicPattern"
              patternUnits="userSpaceOnUse"
              width="600"
              height="80"
            >
              <image
                href="/mosaic-flowers-proportional.png"
                x="0"
                y="-15"
                width="600"
                height="110"
                preserveAspectRatio="none"
              />
            </pattern>

            {/* Very thin wave shape edge-to-edge */}
            <clipPath id="thinWaveClip">
              <path d="M 0,26 C 240,46 480,6 720,26 C 960,46 1200,6 1440,26 C 1680,46 1820,12 1920,26 L 1920,56 C 1820,42 1680,76 1440,56 C 1200,36 960,76 720,56 C 480,36 240,76 0,56 Z" />
            </clipPath>
          </defs>

          {/* Underlay soft shadow */}
          <path
            d="M 0,26 C 240,46 480,6 720,26 C 960,46 1200,6 1440,26 C 1680,46 1820,12 1920,26 L 1920,56 C 1820,42 1680,76 1440,56 C 1200,36 960,76 720,56 C 480,36 240,76 0,56 Z"
            fill="#101520"
            opacity="0.20"
            transform="translate(0, 3)"
          />

          {/* Mosaic Wave Fill */}
          <g clipPath="url(#thinWaveClip)">
            <rect width="1920" height="80" fill="#141824" />
            <rect width="1920" height="80" fill="url(#thinMosaicPattern)" />
            {/* Soft ambient darkening */}
            <rect width="1920" height="80" fill="black" opacity="0.12" />
          </g>

          {/* Top Delicate Flowing Gold Trim */}
          <path
            d="M 0,26 C 240,46 480,6 720,26 C 960,46 1200,6 1440,26 C 1680,46 1820,12 1920,26"
            fill="none"
            stroke="url(#goldSheenThin)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 0,26 C 240,46 480,6 720,26 C 960,46 1200,6 1440,26 C 1680,46 1820,12 1920,26"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeOpacity="0.45"
          />

          {/* Bottom Delicate Flowing Gold Trim */}
          <path
            d="M 0,56 C 240,76 480,36 720,56 C 960,76 1200,36 1440,56 C 1680,76 1820,42 1920,56"
            fill="none"
            stroke="url(#goldSheenThin)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M 0,56 C 240,76 480,36 720,56 C 960,76 1200,36 1440,56 C 1680,76 1820,42 1920,56"
            fill="none"
            stroke="#161B26"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}
