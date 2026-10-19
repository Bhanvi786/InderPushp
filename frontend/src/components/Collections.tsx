"use client";
import React, { useEffect, useState, useMemo } from "react";
import { ArrowRight, RefreshCw, AlertCircle, Layers, ShoppingBag, Check } from "lucide-react";
import { Artwork, Category } from "../types/artwork";
import { artworksApi, categoriesApi } from "../lib/api";
import { getImageKitUrl } from "../lib/imagekit";
import { useCart } from "../context/CartContext";
import ArtworkDetailModal from "./ArtworkDetailModal";
import AddToCartButton from "./AddToCartButton";

const ITEMS_PER_PAGE = 12;

export default function Collections() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Works");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state (for large collections)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Detail Modal state
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Cart integration
  const { addItem, openCart } = useCart();
  const [addedIds, setAddedIds] = useState<{ [id: string]: boolean }>({});

  const handleAddToCart = (e: React.MouseEvent, artwork: Artwork) => {
    e.stopPropagation();
    addItem(artwork, 1);
    setAddedIds((prev) => ({ ...prev, [artwork._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [artwork._id]: false }));
    }, 2200);
  };

  // Fetch published artworks and dynamic categories
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [artworksData, categoriesData] = await Promise.all([
        artworksApi.getPublic(),
        categoriesApi.getPublic(),
      ]);

      setArtworks(artworksData);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error("Error loading gallery artworks:", err);
      setError("Unable to load the collection right now. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter artworks by category
  const filteredArtworks = useMemo(() => {
    if (selectedCategory === "All Works") {
      return artworks;
    }
    return artworks.filter(
      (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [artworks, selectedCategory]);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setActiveArtwork(artwork);
    setModalOpen(true);
  };

  // Dynamically map artworks strictly based on user/admin displayOrder
  const tile1Artwork = filteredArtworks[0];
  const tile2Artwork = filteredArtworks[1];
  const tile3Artwork = filteredArtworks[2];
  const tile4Artwork = filteredArtworks[3];
  const tile5Artwork = filteredArtworks[4];

  const isAllWorksSelected = selectedCategory === "All Works";
  const visibleArtworks = filteredArtworks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArtworks.length;

  return (
    <section
      id="collections"
      className="w-full py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 xl:px-16 bg-[#FAF7F0] relative overflow-hidden text-[#263248]"
    >
      {/* ======================================================== */}
      {/* CORNER & AMBIENT DECORATIVE MOSAIC ELEMENTS              */}
      {/* ======================================================== */}

      {/* Top-Right Decorative Flowing Lines & Phrase */}
      <div className="absolute top-6 right-6 md:top-10 md:right-12 hidden lg:flex items-start gap-3 pointer-events-none z-10 select-none">
        <svg
          className="w-24 h-24 text-[#B79A5A]/35 overflow-visible"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M10,0 C40,40 60,10 100,50 C80,80 100,100 120,120" />
          <path d="M30,0 C60,30 70,20 100,80" />
        </svg>
        <div className="text-right tracking-[0.25em] text-[10px] font-sans font-medium text-[#B79A5A] uppercase leading-relaxed pt-2">
          FRAGMENTS<br />
          THAT TELL<br />
          BIGGER STORIES
        </div>
      </div>

      {/* Bottom-Left Mosaic Tesserae Border */}
      <div className="absolute -bottom-2 -left-2 pointer-events-none z-0 hidden md:block select-none">
        <svg
          className="w-56 h-56 lg:w-72 lg:h-72"
          viewBox="0 0 240 240"
          fill="none"
        >
          <g opacity="0.85">
            <polygon points="0,240 30,240 25,210 0,215" fill="#263248" />
            <polygon points="32,240 65,240 60,215 28,212" fill="#3B5998" />
            <polygon points="67,240 100,240 92,220 62,217" fill="#263248" />
            <polygon points="102,240 135,240 128,222 95,221" fill="#B79A5A" />
            <polygon points="137,240 170,240 162,228 130,223" fill="#3B5998" />
            <polygon points="172,240 205,240 198,232 165,229" fill="#263248" />

            <polygon points="0,212 24,208 20,180 0,185" fill="#3B5998" />
            <polygon points="26,209 58,212 52,185 22,182" fill="#B79A5A" />
            <polygon points="60,214 90,218 84,192 55,187" fill="#263248" />
            <polygon points="92,219 125,221 118,198 86,194" fill="#D8C594" />

            <polygon points="0,182 18,178 14,152 0,156" fill="#263248" />
            <polygon points="20,179 50,183 44,158 16,154" fill="#3B5998" />
            <polygon points="52,184 82,189 75,165 46,160" fill="#B79A5A" />

            <polygon points="0,153 14,150 10,126 0,130" fill="#B79A5A" />
            <polygon points="16,151 42,156 36,132 12,128" fill="#263248" />
            <polygon points="0,127 9,124 6,102 0,105" fill="#3B5998" />
          </g>
        </svg>
      </div>

      {/* Bottom-Right Mosaic Tesserae Border */}
      <div className="absolute -bottom-2 -right-2 pointer-events-none z-0 hidden md:block select-none">
        <svg
          className="w-44 h-44 lg:w-56 lg:h-56"
          viewBox="0 0 200 200"
          fill="none"
        >
          <g opacity="0.85">
            <polygon points="200,200 170,200 175,175 200,180" fill="#263248" />
            <polygon points="168,200 135,200 140,178 173,176" fill="#3B5998" />
            <polygon points="133,200 100,200 108,182 138,179" fill="#B79A5A" />
            <polygon points="200,178 176,174 180,150 200,154" fill="#3B5998" />
            <polygon points="174,173 142,176 148,152 178,149" fill="#D8C594" />
            <polygon points="200,152 182,148 186,126 200,129" fill="#263248" />
            <polygon points="200,127 188,124 192,104 200,106" fill="#B79A5A" />
          </g>
        </svg>
      </div>

      <div className="max-w-[1560px] mx-auto relative z-10">

        {/* ======================================================== */}
        {/* 1. EDITORIAL HEADER & FILTER PILLS                       */}
        {/* ======================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-12 gap-6">
          {/* Left: Gold Label, Heading, and Subtitle */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1.5px] bg-[#B79A5A]" />
              <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-medium">
                EXPLORE THE COLLECTION
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#263248] tracking-tight font-normal leading-[1.15]">
              A Mosaic of Stories
            </h2>

            <p className="text-[#4B5568] text-sm md:text-base font-sans mt-2.5 leading-relaxed">
              Art that brings colour, culture and meaning to everyday spaces.
            </p>
          </div>

          {/* Right: Category Filter Pills Aligned Alongside */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {/* "ALL WORKS" Pill */}
            <button
              type="button"
              onClick={() => handleCategorySelect("All Works")}
              className={`px-4 sm:px-5 py-2 rounded-full text-[11px] font-sans tracking-wider uppercase font-semibold transition-all duration-300 shadow-2xs ${selectedCategory === "All Works"
                ? "bg-[#263248] text-[#FAF7F0] border border-[#263248] shadow-sm"
                : "bg-white/80 hover:bg-white text-[#4B5568] hover:text-[#263248] border border-[#B79A5A]/35"
                }`}
            >
              ALL WORKS ({artworks.length})
            </button>

            {/* Dynamic Category Pills */}
            {categories.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  type="button"
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-[11px] font-sans tracking-wider uppercase font-semibold transition-all duration-300 shadow-2xs ${isSelected
                    ? "bg-[#263248] text-[#FAF7F0] border border-[#263248] shadow-sm"
                    : "bg-white/80 hover:bg-white text-[#4B5568] hover:text-[#263248] border border-[#B79A5A]/35"
                    }`}
                >
                  {cat.name}
                  {cat.artworkCount !== undefined && cat.artworkCount > 0 && (
                    <span className="ml-1 opacity-70">({cat.artworkCount})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. GALLERY STATES: LOADING / ERROR / EMPTY               */}
        {/* ======================================================== */}
        {loading ? (
          /* Editorial Skeleton Loader */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5 w-full animate-pulse">
            <div className="md:col-span-4 h-[560px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
            <div className="md:col-span-5 h-[280px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
            <div className="md:col-span-3 h-[340px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
            <div className="md:col-span-5 h-[260px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
            <div className="md:col-span-7 h-[260px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-12 text-center rounded-2xl bg-white border border-[#B79A5A]/30 max-w-lg mx-auto space-y-4">
            <AlertCircle size={32} className="text-[#B79A5A] mx-auto" />
            <h3 className="text-lg font-serif text-[#263248]">Atelier Collection Temporarily Unavailable</h3>
            <p className="text-xs font-sans text-[#4B5568] leading-relaxed">{error}</p>
            <button
              type="button"
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#263248] text-white text-xs font-sans uppercase tracking-wider font-semibold hover:bg-[#384055]"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : filteredArtworks.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center rounded-2xl bg-white/70 border border-[#B79A5A]/25 max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#B79A5A]/40 flex items-center justify-center text-[#B79A5A] mx-auto">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-serif text-[#263248] font-normal">
              No Creations In &quot;{selectedCategory}&quot; Yet
            </h3>
            <p className="text-xs font-sans text-[#4B5568] leading-relaxed max-w-md mx-auto">
              The artist is currently handcrafting works for this category. Explore &quot;All Works&quot; or return soon to preview newly published masterpieces.
            </p>
            <button
              type="button"
              onClick={() => handleCategorySelect("All Works")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#263248] hover:bg-[#B79A5A] text-[#FAF7F0] text-xs font-sans uppercase tracking-wider font-semibold transition-colors"
            >
              View All Works
            </button>
          </div>
        ) : isAllWorksSelected && tile1Artwork && tile2Artwork && tile3Artwork && tile4Artwork && tile5Artwork ? (
          /* ======================================================== */
          /* 3. PRIMARY REFERENCE MOSAIC COMPOSITION (ALL WORKS)      */
          /* ======================================================== */
          <div className="space-y-4 sm:space-y-5">
            {/* Master Grid: Slot 1 (Tall Left) alongside the Middle/Right cluster */}
            {/* Preserves the exact same orientation on mobile as laptop, scaled proportionally */}
            <div className="grid grid-cols-12 gap-2.5 xs:gap-3 sm:gap-4 lg:gap-5 items-stretch">

              {/* ---------------------------------------------------- */}
              {/* TILE 1: (Tall Portrait on Left) - Slot #1            */}
              {/* ---------------------------------------------------- */}
              <div className="col-span-5 lg:col-span-4 flex flex-col">
                <article
                  onClick={() => handleArtworkClick(tile1Artwork)}
                  className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl bg-[#263248] border border-[#B79A5A]/20 hover:border-[#B79A5A] transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1 h-[270px] xs:h-[330px] sm:h-[480px] lg:h-[580px] flex flex-col justify-end"
                >
                  <img
                    src={getImageKitUrl(tile1Artwork.mainImage?.url, {
                      width: 1000,
                      quality: 88,
                      format: "webp",
                    })}
                    alt={tile1Artwork.mainImage?.alt || tile1Artwork.title}
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Dark gradient overlay matching reference */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                  {/* Artwork Information: On mobile, only MRP and Add button are shown; title/category show from sm upwards */}
                  <div className="relative z-10 p-2.5 xs:p-3.5 sm:p-6 lg:p-7 flex items-end justify-between gap-1.5 xs:gap-2">
                    <div className="min-w-0">
                      <span className="hidden sm:block text-[8px] xs:text-[9px] sm:text-[11px] font-sans tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#D8C594] font-medium mb-0.5">
                        {tile1Artwork.category}
                      </span>
                      <h3 className="hidden sm:block text-xs xs:text-sm sm:text-2xl font-serif text-white font-normal leading-tight xs:leading-snug line-clamp-2">
                        {tile1Artwork.title}
                      </h3>
                      <p className="text-sm xs:text-base sm:text-base sm:mt-1 font-serif font-bold text-white drop-shadow-md tracking-tight leading-none">
                        ₹{tile1Artwork.priceINR.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                      <AddToCartButton artwork={tile1Artwork} />
                    </div>
                  </div>
                </article>

                {/* Decorative Bottom-Left Botanical flourish + text (desktop only) */}
                <div className="mt-6 hidden lg:flex items-center gap-4 pl-3 select-none">
                  {/* Subtle botanical branch SVG */}
                  <svg
                    className="w-20 h-14 text-[#B79A5A]/50 shrink-0"
                    viewBox="0 0 100 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M0,50 Q40,35 90,10" />
                    <path d="M25,40 Q35,25 30,15 Q40,25 45,33" fill="currentColor" fillOpacity="0.15" />
                    <path d="M55,27 Q65,15 62,5 Q70,18 73,20" fill="currentColor" fillOpacity="0.15" />
                    <path d="M78,16 Q88,5 95,0 Q92,12 88,13" fill="currentColor" fillOpacity="0.15" />
                  </svg>
                  <p className="font-serif italic text-[#4B5568] text-base leading-snug">
                    Small pieces.<br />
                    <span className="ml-3">Larger meanings.</span>
                  </p>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* MIDDLE & RIGHT COMBINED AREA                         */}
              {/* ---------------------------------------------------- */}
              <div className="col-span-7 lg:col-span-8 flex flex-col justify-between gap-2.5 xs:gap-3 sm:gap-4 lg:gap-5">

                {/* Upper Sub-Row: Slot 2 (Wide) & Slot 3 (Arched) */}
                <div className="grid grid-cols-12 gap-2 xs:gap-2.5 sm:gap-4 lg:gap-5 items-stretch">

                  {/* TILE 2: (Wide horizontal tile) - Slot #2 */}
                  <div className="col-span-7">
                    <article
                      onClick={() => handleArtworkClick(tile2Artwork)}
                      className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl bg-[#263248] border border-[#B79A5A]/20 hover:border-[#B79A5A] transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1 h-[130px] xs:h-[160px] sm:h-[235px] lg:h-[320px] flex flex-col justify-end"
                    >
                      <img
                        src={getImageKitUrl(tile2Artwork.mainImage?.url, {
                          width: 1000,
                          quality: 88,
                          format: "webp",
                        })}
                        alt={tile2Artwork.mainImage?.alt || tile2Artwork.title}
                        className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                      <div className="relative z-10 p-2.5 xs:p-3 sm:p-6 flex items-end justify-between gap-1.5 xs:gap-2">
                        <div className="min-w-0">
                          <span className="hidden sm:block text-[8px] xs:text-[9px] sm:text-[11px] font-sans tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#D8C594] font-medium mb-0.5">
                            {tile2Artwork.category}
                          </span>
                          <h3 className="hidden sm:block text-xs xs:text-sm sm:text-xl font-serif text-white font-normal leading-tight xs:leading-snug line-clamp-1">
                            {tile2Artwork.title}
                          </h3>
                          <p className="text-xs xs:text-sm sm:text-base sm:mt-0.5 font-serif font-bold text-white drop-shadow-md tracking-tight leading-none">
                            ₹{tile2Artwork.priceINR.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                          <AddToCartButton artwork={tile2Artwork} />
                        </div>
                      </div>
                    </article>
                  </div>

                  {/* TILE 3: (Tall tile on upper-right with arched top-right corner) - Slot #3 */}
                  <div className="col-span-5">
                    <article
                      onClick={() => handleArtworkClick(tile3Artwork)}
                      className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl rounded-tr-[28px] xs:rounded-tr-[36px] sm:rounded-tr-[44px] bg-[#263248] border border-[#B79A5A]/20 hover:border-[#B79A5A] transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1 h-[130px] xs:h-[160px] sm:h-[235px] lg:h-[320px] flex flex-col justify-end"
                    >
                      <img
                        src={getImageKitUrl(tile3Artwork.mainImage?.url, {
                          width: 800,
                          quality: 88,
                          format: "webp",
                        })}
                        alt={tile3Artwork.mainImage?.alt || tile3Artwork.title}
                        className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                      <div className="relative z-10 p-2.5 xs:p-3 sm:p-5 flex items-end justify-between gap-1 xs:gap-2">
                        <div className="min-w-0">
                          <span className="hidden sm:block text-[8px] xs:text-[9px] font-sans tracking-[0.2em] uppercase text-[#D8C594] font-medium mb-0.5">
                            {tile3Artwork.category}
                          </span>
                          <h3 className="hidden sm:block text-xs xs:text-sm sm:text-lg font-serif text-white font-normal leading-tight xs:leading-snug line-clamp-1">
                            {tile3Artwork.title}
                          </h3>
                          <p className="text-xs xs:text-sm sm:text-sm sm:mt-0.5 font-serif font-bold text-white drop-shadow-md tracking-tight leading-none">
                            ₹{tile3Artwork.priceINR.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                          <AddToCartButton artwork={tile3Artwork} />
                        </div>
                      </div>
                    </article>
                  </div>

                </div>

                {/* Lower Sub-Row: Slot 4 (Circular Frame) & Slot 5 (Horizontal Split) */}
                <div className="grid grid-cols-12 gap-2 xs:gap-2.5 sm:gap-4 lg:gap-5 items-stretch">

                  {/* TILE 4: (Circular Artwork with delicate laurel accents) - Slot #4 */}
                  <div className="col-span-5 flex flex-col">
                    <article
                      onClick={() => handleArtworkClick(tile4Artwork)}
                      className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl bg-white/70 border border-[#B79A5A]/25 hover:border-[#B79A5A] transition-all duration-500 shadow-2xs hover:shadow-xl hover:-translate-y-1 p-2 xs:p-2.5 sm:p-5 flex flex-col justify-between h-[130px] xs:h-[160px] sm:h-[235px] lg:h-[340px]"
                    >
                      {/* Decorative Gold Laurel Arch */}
                      <svg
                        className="absolute top-1 right-2 w-16 h-16 sm:w-28 sm:h-28 text-[#B79A5A]/35 pointer-events-none hidden xs:block"
                        viewBox="0 0 100 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      >
                        <path d="M10,80 Q50,20 90,40" />
                        <path d="M40,35 Q50,20 48,10 Q58,22 62,28" fill="currentColor" fillOpacity="0.2" />
                        <path d="M68,32 Q78,20 80,10 Q85,25 88,33" fill="currentColor" fillOpacity="0.2" />
                      </svg>

                      {/* Circular mosaic artwork frame */}
                      <div className="relative mx-auto w-14 h-14 xs:w-18 xs:h-18 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-md border border-[#B79A5A]/30 p-0.5 sm:p-1 bg-[#FAF7F0] flex items-center justify-center shrink-0">
                        <img
                          src={getImageKitUrl(tile4Artwork.mainImage?.url, {
                            width: 600,
                            quality: 88,
                            format: "webp",
                          })}
                          alt={tile4Artwork.mainImage?.alt || tile4Artwork.title}
                          className="w-full h-full object-contain rounded-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />
                      </div>

                      {/* Clean cream information placard */}
                      <div className="pt-1 xs:pt-1.5 sm:pt-3 border-t border-[#B79A5A]/15 flex items-end justify-between gap-1 xs:gap-2">
                        <div className="min-w-0">
                          <span className="hidden sm:block text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-sans tracking-[0.18em] sm:tracking-[0.25em] uppercase text-[#B79A5A] font-medium leading-none mb-0.5">
                            {tile4Artwork.category}
                          </span>
                          <h3 className="hidden sm:block text-[10px] xs:text-xs sm:text-lg font-serif text-[#263248] font-normal leading-tight group-hover:text-[#B79A5A] transition-colors line-clamp-1">
                            {tile4Artwork.title}
                          </h3>
                          <p className="text-[11px] xs:text-xs sm:text-sm sm:mt-0.5 font-serif font-bold text-[#1E2738] tracking-tight leading-none">
                            ₹{tile4Artwork.priceINR.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                          <AddToCartButton artwork={tile4Artwork} />
                        </div>
                      </div>
                    </article>
                  </div>

                  {/* TILE 5: (Wide card with image on left, cream placard on right) - Slot #5 */}
                  <div className="col-span-7 flex flex-col">
                    <article
                      onClick={() => handleArtworkClick(tile5Artwork)}
                      className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl bg-white border border-[#B79A5A]/25 hover:border-[#B79A5A] transition-all duration-500 shadow-2xs hover:shadow-xl hover:-translate-y-1 flex flex-row items-stretch h-[130px] xs:h-[160px] sm:h-[235px] lg:h-[340px]"
                    >
                      {/* Image Occupies ~60-68% of available space */}
                      <div className="w-[58%] xs:w-[62%] sm:w-[68%] relative overflow-hidden bg-[#FAF7F0] h-full">
                        <img
                          src={getImageKitUrl(tile5Artwork.mainImage?.url, {
                            width: 1000,
                            quality: 88,
                            format: "webp",
                          })}
                          alt={tile5Artwork.mainImage?.alt || tile5Artwork.title}
                          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </div>

                      {/* Information placed beside image on right */}
                      <div className="w-[42%] xs:w-[38%] sm:w-[32%] p-2 xs:p-2.5 sm:p-6 bg-white flex flex-col justify-end sm:justify-between border-l border-[#B79A5A]/15">
                        <div className="min-w-0 hidden sm:block">
                          <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-sans tracking-[0.18em] sm:tracking-[0.25em] uppercase text-[#B79A5A] font-medium block leading-none mb-0.5">
                            {tile5Artwork.category}
                          </span>
                          <h3 className="text-[10.5px] xs:text-xs sm:text-xl font-serif text-[#263248] font-normal leading-tight xs:leading-snug group-hover:text-[#B79A5A] transition-colors line-clamp-1 xs:line-clamp-2">
                            {tile5Artwork.title}
                          </h3>
                        </div>

                        <div className="pt-0 sm:pt-3 sm:border-t sm:border-[#B79A5A]/15 flex items-end justify-between gap-1 xs:gap-1.5">
                          <p className="text-[11px] xs:text-xs sm:text-base font-serif font-bold text-[#1E2738] tracking-tight leading-none">
                            ₹{tile5Artwork.priceINR.toLocaleString("en-IN")}
                          </p>

                          <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                            <AddToCartButton artwork={tile5Artwork} />
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>

                </div>

              </div>

            </div>

            {/* ---------------------------------------------------- */}
            {/* ADDITIONAL ARTWORKS (RENDERED BELOW HERO MOSAIC)     */}
            {/* ---------------------------------------------------- */}
            {visibleArtworks.slice(5).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5 items-stretch mt-4 sm:mt-5 pt-2">
                {visibleArtworks.slice(5)
                  .map((artwork, idx, arr) => {
                    let colSpan = "col-span-12 md:col-span-6 lg:col-span-6";
                    if (arr.length === 1) {
                      colSpan = "col-span-12 lg:col-span-7";
                    } else if (arr.length % 2 !== 0 && idx === 0) {
                      colSpan = "col-span-12 lg:col-span-12";
                    } else {
                      colSpan = idx % 2 === 0 ? "col-span-12 md:col-span-7" : "col-span-12 md:col-span-5";
                    }
                    return (
                      <div key={artwork._id} className={colSpan}>
                        <article
                          onClick={() => handleArtworkClick(artwork)}
                          className="group cursor-pointer relative overflow-hidden rounded-2xl bg-[#263248] border border-[#B79A5A]/20 hover:border-[#B79A5A] transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1 h-[280px] sm:h-[320px] lg:h-[340px] flex flex-col justify-end"
                        >
                          <img
                            src={getImageKitUrl(artwork.mainImage?.url, {
                              width: 1000,
                              quality: 88,
                              format: "webp",
                            })}
                            alt={artwork.mainImage?.alt || artwork.title}
                            className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                          <div className="relative z-10 p-5 sm:p-6 flex items-end justify-between gap-4">
                            <div className="min-w-0">
                              <span className="hidden sm:block text-[10px] sm:text-[11px] font-sans tracking-[0.25em] uppercase text-[#D8C594] font-medium mb-1">
                                {artwork.category}
                              </span>
                              <h3 className="hidden sm:block text-lg sm:text-xl font-serif text-white font-normal leading-snug">
                                {artwork.title}
                              </h3>
                              <p className="text-sm sm:text-base sm:mt-0.5 font-serif font-bold text-white leading-none">
                                ₹{artwork.priceINR.toLocaleString("en-IN")}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <AddToCartButton artwork={artwork} />
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ) : (
          /* ======================================================== */
          /* 4. BALANCED MOSAIC FOR FILTERED SUBSETS                  */
          /* ======================================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArtworks.map((artwork) => (
              <article
                key={artwork._id}
                onClick={() => handleArtworkClick(artwork)}
                className="group cursor-pointer relative overflow-hidden rounded-2xl bg-[#263248] border border-[#B79A5A]/20 hover:border-[#B79A5A] transition-all duration-500 shadow-md hover:shadow-xl hover:-translate-y-1 h-[360px] flex flex-col justify-end"
              >
                <img
                  src={getImageKitUrl(artwork.mainImage?.url, {
                    width: 900,
                    quality: 85,
                    format: "webp",
                  })}
                  alt={artwork.mainImage?.alt || artwork.title}
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                <div className="relative z-10 p-6 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <span className="hidden sm:block text-[10px] font-sans tracking-[0.25em] uppercase text-[#D8C594] font-medium mb-1">
                      {artwork.category}
                    </span>
                    <h3 className="hidden sm:block text-xl font-serif text-white font-normal leading-snug">
                      {artwork.title}
                    </h3>
                    <p className="text-sm sm:mt-1 font-serif font-bold text-white leading-none">
                      ₹{artwork.priceINR.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <AddToCartButton artwork={artwork} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 5. MODAL: DETAILED ARTWORK INSPECTION                    */}
      {/* ======================================================== */}
      <ArtworkDetailModal
        artwork={activeArtwork}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveArtwork(null);
        }}
        onSelectCategory={handleCategorySelect}
      />
    </section>
  );
}
