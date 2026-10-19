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

      <div className="max-w-[1320px] mx-auto relative z-10">

        {/* ======================================================== */}
        {/* 1. EDITORIAL HEADER & FILTER PILLS                       */}
        {/* ======================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 sm:mb-9 gap-5">
          {/* Left: Gold Label, Heading, and Subtitle */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-[1.5px] bg-[#B79A5A]" />
              <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-medium">
                EXPLORE THE COLLECTION
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#263248] tracking-tight font-normal leading-[1.15]">
              A Mosaic of Stories
            </h2>

            <p className="text-[#4B5568] text-xs sm:text-sm font-sans mt-2 leading-relaxed">
              Art that brings colour, culture and meaning to everyday spaces.
            </p>
          </div>

          {/* Right: Category Filter Pills Aligned Alongside */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap pt-1">
            {/* "ALL WORKS" Pill */}
            <button
              type="button"
              onClick={() => handleCategorySelect("All Works")}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10.5px] sm:text-[11px] font-sans tracking-wider uppercase font-semibold transition-all duration-300 shadow-2xs ${selectedCategory === "All Works"
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
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10.5px] sm:text-[11px] font-sans tracking-wider uppercase font-semibold transition-all duration-300 shadow-2xs ${isSelected
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-4.5 w-full animate-pulse">
            <div className="md:col-span-4 h-[440px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
            <div className="md:col-span-5 h-[210px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
            <div className="md:col-span-3 h-[250px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
            <div className="md:col-span-5 h-[210px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
            <div className="md:col-span-7 h-[210px] bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
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
        ) : filteredArtworks.length > 0 ? (
          /* ======================================================== */
          /* 3. CONTINUOUS HARMONIC MOSAIC COMPOSITION (ALL ARTWORKS)  */
          /* ======================================================== */
          <div className="space-y-4 sm:space-y-6">
            {/* Chunk artworks into groups of 5 to repeat the exact artistic mosaic rhythm */}
            {Array.from({ length: Math.ceil(filteredArtworks.length / 5) }).map((_, blockIdx) => {
              const blockArtworks = filteredArtworks.slice(blockIdx * 5, blockIdx * 5 + 5);
              const isEvenBlock = blockIdx % 2 === 0;

              const a1 = blockArtworks[0];
              const a2 = blockArtworks[1];
              const a3 = blockArtworks[2];
              const a4 = blockArtworks[3];
              const a5 = blockArtworks[4];

              // If block has fewer than 5 items and only 1 or 2 left, display them cleanly using the exact mosaic card styles
              if (blockArtworks.length < 3) {
                return (
                  <div key={`partial-block-${blockIdx}`} className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-3.5 lg:gap-4 items-stretch">
                    {blockArtworks.map((art) => (
                      <div key={art._id} className={blockArtworks.length === 1 ? "col-span-12 md:col-span-8 lg:col-span-6 mx-auto w-full" : "col-span-12 md:col-span-6"}>
                        <article
                          onClick={() => handleArtworkClick(art)}
                          className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl bg-[#F9F5ED] border border-[#B79A5A]/30 hover:border-[#B79A5A] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 h-[200px] xs:h-[230px] sm:h-[260px] lg:h-[275px] flex flex-col justify-end"
                        >
                          <img
                            src={getImageKitUrl(art.mainImage?.url, {
                              width: 900,
                              quality: 88,
                              format: "webp",
                            })}
                            alt={art.mainImage?.alt || art.title}
                            className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none" />
                          <div className="relative z-10 p-3 sm:p-5 flex items-end justify-between gap-2">
                            <div className="min-w-0">
                              <span className="hidden sm:block text-[8px] xs:text-[9px] sm:text-[10px] font-sans tracking-[0.2em] uppercase text-[#D8C594] font-medium mb-0.5">
                                {art.category}
                              </span>
                              <h3 className="text-xs xs:text-sm sm:text-lg font-serif text-white font-normal leading-tight xs:leading-snug line-clamp-1">
                                {art.title}
                              </h3>
                              <p className="text-xs xs:text-sm sm:text-base sm:mt-0.5 font-serif font-bold text-white drop-shadow-md tracking-tight leading-none">
                                ₹{art.priceINR.toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <AddToCartButton artwork={art} />
                            </div>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div
                  key={`mosaic-block-${blockIdx}`}
                  className="grid grid-cols-12 gap-2.5 xs:gap-3 sm:gap-3.5 lg:gap-4 items-stretch"
                >
                  {/* ======================================================== */}
                  {/* TALL FEATURE CARD (Slot #1)                             */}
                  {/* Even blocks: Left (col-span-5 lg:col-span-4, order-1)    */}
                  {/* Odd blocks: Right (col-span-5 lg:col-span-4, order-2)   */}
                  {/* ======================================================== */}
                  <div className={`col-span-5 lg:col-span-4 flex flex-col ${isEvenBlock ? "order-1" : "order-2"}`}>
                    <article
                      onClick={() => handleArtworkClick(a1)}
                      className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl bg-[#F9F5ED] border border-[#B79A5A]/30 hover:border-[#B79A5A] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 h-[240px] xs:h-[290px] sm:h-[400px] lg:h-[470px] flex flex-col justify-end"
                    >
                      <img
                        src={getImageKitUrl(a1.mainImage?.url, {
                          width: 900,
                          quality: 88,
                          format: "webp",
                        })}
                        alt={a1.mainImage?.alt || a1.title}
                        className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-32 sm:h-36 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none" />

                      <div className="relative z-10 p-2.5 xs:p-3 sm:p-5 lg:p-5 flex items-end justify-between gap-1.5 xs:gap-2">
                        <div className="min-w-0">
                          <span className="hidden sm:block text-[8px] xs:text-[9px] sm:text-[10px] font-sans tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#D8C594] font-medium mb-0.5">
                            {a1.category}
                          </span>
                          <h3 className="hidden sm:block text-xs xs:text-sm sm:text-xl font-serif text-white font-normal leading-tight xs:leading-snug line-clamp-2">
                            {a1.title}
                          </h3>
                          <p className="text-xs xs:text-sm sm:text-base sm:mt-1 font-serif font-bold text-white drop-shadow-md tracking-tight leading-none">
                            ₹{a1.priceINR.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                          <AddToCartButton artwork={a1} />
                        </div>
                      </div>
                    </article>

                    {/* Subtle botanical flourish on the first block */}
                    {blockIdx === 0 && (
                      <div className="mt-4 hidden lg:flex items-center gap-3 pl-2 select-none">
                        <svg
                          className="w-16 h-11 text-[#B79A5A]/50 shrink-0"
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
                        <p className="font-serif italic text-[#4B5568] text-sm leading-snug">
                          Small pieces.<br />
                          <span className="ml-2.5">Larger meanings.</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* 4-CARD CLUSTER (Slots #2, #3, #4, #5)                    */}
                  {/* Even blocks: Right (col-span-7 lg:col-span-8, order-2)  */}
                  {/* Odd blocks: Left (col-span-7 lg:col-span-8, order-1)    */}
                  {/* ======================================================== */}
                  <div className={`col-span-7 lg:col-span-8 flex flex-col justify-between gap-2 xs:gap-2.5 sm:gap-3 lg:gap-3.5 ${isEvenBlock ? "order-2" : "order-1"}`}>

                    {/* Upper Sub-Row: Slot 2 & Slot 3 */}
                    <div className="grid grid-cols-12 gap-2 xs:gap-2 sm:gap-3 lg:gap-3.5 items-stretch">
                      {/* TILE 2: Wide Horizontal Card */}
                      {a2 && (
                        <div className={a3 ? "col-span-7" : "col-span-12"}>
                          <article
                            onClick={() => handleArtworkClick(a2)}
                            className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl bg-[#F9F5ED] border border-[#B79A5A]/30 hover:border-[#B79A5A] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 h-[115px] xs:h-[140px] sm:h-[195px] lg:h-[260px] flex flex-col justify-end"
                          >
                            <img
                              src={getImageKitUrl(a2.mainImage?.url, {
                                width: 900,
                                quality: 88,
                                format: "webp",
                              })}
                              alt={a2.mainImage?.alt || a2.title}
                              className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />

                            <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none" />

                            <div className="relative z-10 p-2 xs:p-2.5 sm:p-4.5 flex items-end justify-between gap-1 xs:gap-1.5">
                              <div className="min-w-0">
                                <span className="hidden sm:block text-[8px] xs:text-[9px] sm:text-[10px] font-sans tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#D8C594] font-medium mb-0.5">
                                  {a2.category}
                                </span>
                                <h3 className="hidden sm:block text-xs xs:text-sm sm:text-lg font-serif text-white font-normal leading-tight xs:leading-snug line-clamp-1">
                                  {a2.title}
                                </h3>
                                <p className="text-xs xs:text-sm sm:text-sm sm:mt-0.5 font-serif font-bold text-white drop-shadow-md tracking-tight leading-none">
                                  ₹{a2.priceINR.toLocaleString("en-IN")}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                                <AddToCartButton artwork={a2} />
                              </div>
                            </div>
                          </article>
                        </div>
                      )}

                      {/* TILE 3: Compact / Arched Card */}
                      {a3 && (
                        <div className="col-span-5">
                          <article
                            onClick={() => handleArtworkClick(a3)}
                            className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl rounded-tr-[24px] xs:rounded-tr-[30px] sm:rounded-tr-[38px] bg-[#F9F5ED] border border-[#B79A5A]/30 hover:border-[#B79A5A] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 h-[115px] xs:h-[140px] sm:h-[195px] lg:h-[260px] flex flex-col justify-end"
                          >
                            <img
                              src={getImageKitUrl(a3.mainImage?.url, {
                                width: 700,
                                quality: 88,
                                format: "webp",
                              })}
                              alt={a3.mainImage?.alt || a3.title}
                              className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />

                            <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none" />

                            <div className="relative z-10 p-2 xs:p-2.5 sm:p-4 flex items-end justify-between gap-1 xs:gap-1.5">
                              <div className="min-w-0">
                                <span className="hidden sm:block text-[8px] xs:text-[9px] font-sans tracking-[0.2em] uppercase text-[#D8C594] font-medium mb-0.5">
                                  {a3.category}
                                </span>
                                <h3 className="hidden sm:block text-xs xs:text-sm sm:text-base font-serif text-white font-normal leading-tight xs:leading-snug line-clamp-1">
                                  {a3.title}
                                </h3>
                                <p className="text-xs xs:text-sm sm:text-sm sm:mt-0.5 font-serif font-bold text-white drop-shadow-md tracking-tight leading-none">
                                  ₹{a3.priceINR.toLocaleString("en-IN")}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                                <AddToCartButton artwork={a3} />
                              </div>
                            </div>
                          </article>
                        </div>
                      )}
                    </div>

                    {/* Lower Sub-Row: Slot 4 (Circular Frame) & Slot 5 (Horizontal Split) */}
                    {(a4 || a5) && (
                      <div className="grid grid-cols-12 gap-2 xs:gap-2 sm:gap-3 lg:gap-3.5 items-stretch">
                        {/* TILE 4: Circular Artwork Card */}
                        {a4 && (
                          <div className={a5 ? "col-span-5 flex flex-col" : "col-span-12 flex flex-col"}>
                            <article
                              onClick={() => handleArtworkClick(a4)}
                              className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl bg-[#F9F5ED] border border-[#B79A5A]/30 hover:border-[#B79A5A] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 p-2 xs:p-2.5 sm:p-4 flex flex-col justify-between h-[115px] xs:h-[140px] sm:h-[195px] lg:h-[275px]"
                            >
                              <svg
                                className="absolute top-1 right-2 w-14 h-14 sm:w-22 sm:h-22 text-[#B79A5A]/35 pointer-events-none hidden xs:block"
                                viewBox="0 0 100 100"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.2"
                              >
                                <path d="M10,80 Q50,20 90,40" />
                                <path d="M40,35 Q50,20 48,10 Q58,22 62,28" fill="currentColor" fillOpacity="0.2" />
                                <path d="M68,32 Q78,20 80,10 Q85,25 88,33" fill="currentColor" fillOpacity="0.2" />
                              </svg>

                              <div className="relative mx-auto my-auto w-16 h-16 xs:w-20 xs:h-20 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden shadow-sm border border-[#B79A5A]/35 p-0.5 sm:p-1 bg-[#FAF7F0] flex items-center justify-center shrink-0">
                                <img
                                  src={getImageKitUrl(a4.mainImage?.url, {
                                    width: 600,
                                    quality: 88,
                                    format: "webp",
                                  })}
                                  alt={a4.mainImage?.alt || a4.title}
                                  className="w-full h-full object-contain rounded-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                />
                              </div>

                              <div className="pt-1 xs:pt-1 sm:pt-2 border-t border-[#B79A5A]/20 flex items-end justify-between gap-1 xs:gap-1.5">
                                <div className="min-w-0">
                                  <span className="hidden sm:block text-[7px] xs:text-[8px] sm:text-[9.5px] font-sans tracking-[0.18em] sm:tracking-[0.25em] uppercase text-[#B79A5A] font-medium leading-none mb-0.5">
                                    {a4.category}
                                  </span>
                                  <h3 className="hidden sm:block text-[10px] xs:text-xs sm:text-base font-serif text-[#263248] font-normal leading-tight group-hover:text-[#B79A5A] transition-colors line-clamp-1">
                                    {a4.title}
                                  </h3>
                                  <p className="text-[10.5px] xs:text-xs sm:text-sm sm:mt-0.5 font-serif font-bold text-[#263248] tracking-tight leading-none">
                                    ₹{a4.priceINR.toLocaleString("en-IN")}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                                  <AddToCartButton artwork={a4} />
                                </div>
                              </div>
                            </article>
                          </div>
                        )}

                        {/* TILE 5: Horizontal Split Artwork Card */}
                        {a5 && (
                          <div className="col-span-7 flex flex-col">
                            <article
                              onClick={() => handleArtworkClick(a5)}
                              className="group cursor-pointer relative overflow-hidden rounded-xl xs:rounded-2xl bg-[#F9F5ED] border border-[#B79A5A]/30 hover:border-[#B79A5A] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-row items-stretch h-[115px] xs:h-[140px] sm:h-[195px] lg:h-[275px]"
                            >
                              <div className="w-[58%] xs:w-[62%] sm:w-[66%] relative overflow-hidden bg-[#FAF7F0] h-full">
                                <img
                                  src={getImageKitUrl(a5.mainImage?.url, {
                                    width: 800,
                                    quality: 88,
                                    format: "webp",
                                  })}
                                  alt={a5.mainImage?.alt || a5.title}
                                  className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                />
                              </div>

                              <div className="w-[42%] xs:w-[38%] sm:w-[34%] p-2 xs:p-2.5 sm:p-5 bg-[#F9F5ED] flex flex-col justify-end sm:justify-between border-l border-[#B79A5A]/20">
                                <div className="min-w-0 hidden sm:block">
                                  <span className="text-[7px] xs:text-[8px] sm:text-[9.5px] font-sans tracking-[0.18em] sm:tracking-[0.25em] uppercase text-[#B79A5A] font-medium block leading-none mb-0.5">
                                    {a5.category}
                                  </span>
                                  <h3 className="text-[10px] xs:text-xs sm:text-lg font-serif text-[#263248] font-normal leading-tight xs:leading-snug group-hover:text-[#B79A5A] transition-colors line-clamp-1 xs:line-clamp-2">
                                    {a5.title}
                                  </h3>
                                </div>

                                <div className="pt-0 sm:pt-2 sm:border-t sm:border-[#B79A5A]/20 flex items-end justify-between gap-1 xs:gap-1.5">
                                  <p className="text-[10.5px] xs:text-xs sm:text-sm font-serif font-bold text-[#263248] tracking-tight leading-none">
                                    ₹{a5.priceINR.toLocaleString("en-IN")}
                                  </p>

                                  <div className="flex items-center gap-1 xs:gap-1.5 shrink-0">
                                    <AddToCartButton artwork={a5} />
                                  </div>
                                </div>
                              </div>
                            </article>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        ) : null}

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
