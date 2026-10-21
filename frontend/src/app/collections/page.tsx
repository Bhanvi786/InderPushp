"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MosaicBorderDivider from "@/components/MosaicBorderDivider";
import ArtworkDetailModal from "@/components/ArtworkDetailModal";
import AddToCartButton from "@/components/AddToCartButton";
import { Artwork, Category } from "@/types/artwork";
import { artworksApi, categoriesApi, DEFAULT_CATEGORIES } from "@/lib/api";
import { getImageKitUrl } from "@/lib/imagekit";
import {
  ArrowLeft,
  Sparkles,
  Flower2,
  Compass,
  Palette,
  Frame,
  Home as HomeIcon,
  Layers,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const CATEGORY_META: Record<
  string,
  {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    accentColor: string;
    tagline: string;
  }
> = {
  "floral & nature": {
    icon: Flower2,
    accentColor: "#2D6A4F",
    tagline: "Botanical blossoms, foliage & wildlife in handcrafted glass",
  },
  "figurative & spiritual": {
    icon: Compass,
    accentColor: "#934A5F",
    tagline: "Sacred portraits, Lord Krishna & soulful devotional art",
  },
  "abstract & geometric": {
    icon: Palette,
    accentColor: "#3B5998",
    tagline: "Rhythmic tesserae patterns & contemporary experimental forms",
  },
  "decorative art": {
    icon: Frame,
    accentColor: "#B79A5A",
    tagline: "Mirrors, framed masterworks & functional luxury home decor",
  },
  "art for spaces": {
    icon: HomeIcon,
    accentColor: "#6A4C93",
    tagline: "Architectural wall installations & bespoke mosaic murals",
  },
  other: {
    icon: Sparkles,
    accentColor: "#52796F",
    tagline: "Rare studio creations & signature experimental works",
  },
};

function CollectionsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || "All Works"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal state
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [artworksData, categoriesData] = await Promise.all([
        artworksApi.getPublic(),
        categoriesApi.getPublic(),
      ]);

      setArtworks(artworksData);
      if (categoriesData && categoriesData.length > 0) {
        setCategories(categoriesData);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
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

  const displayCategories = useMemo(() => {
    const list = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
    return list.slice(0, 6);
  }, [categories]);

  const categoryArtworksMap = useMemo(() => {
    const map: Record<string, Artwork[]> = {};
    displayCategories.forEach((cat) => {
      map[cat.name] = artworks.filter(
        (art) => art.category?.toLowerCase() === cat.name.toLowerCase()
      );
    });
    return map;
  }, [artworks, displayCategories]);

  const filteredArtworks = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All Works") {
      return artworks;
    }
    return artworks.filter(
      (art) => art.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [artworks, selectedCategory]);

  const activeMeta = CATEGORY_META[selectedCategory.toLowerCase()] || {
    icon: Layers,
    accentColor: "#B79A5A",
    tagline: "Handcrafted glass & stained mosaic creations",
  };
  const ActiveIcon = activeMeta.icon;

  const handleArtworkClick = (artwork: Artwork) => {
    setActiveArtwork(artwork);
    setModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F4EA] flex flex-col relative text-[#263248]">
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-24 sm:pt-28 md:pt-32 pb-20 px-4 sm:px-6 md:px-12 xl:px-16 max-w-[1440px] mx-auto relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans uppercase tracking-wider text-[#4B5568] hover:text-[#B79A5A] transition-colors font-semibold"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#B79A5A] font-semibold hidden sm:inline">
            InderPushp Atelier
          </span>
        </div>

        {/* Category Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="w-6 h-[1.5px] bg-[#B79A5A]" />
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-semibold">
              COLLECTION GALLERY
            </span>
            <span className="w-6 h-[1.5px] bg-[#B79A5A]" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#263248] tracking-tight font-normal leading-tight">
            {selectedCategory}
          </h1>

          <p className="text-[#4B5568] text-xs sm:text-sm md:text-base font-sans mt-2.5 max-w-xl mx-auto leading-relaxed">
            {activeMeta.tagline}
          </p>
        </div>

        {/* 6 Category Shapes Quick Selector (in 1 line across all screens) */}
        <div className="grid grid-cols-6 gap-1 xs:gap-1.5 sm:gap-3 md:gap-4 lg:gap-5 mb-10 sm:mb-14">
          {displayCategories.map((cat, idx) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            const count = categoryArtworksMap[cat.name]?.length || 0;
            const meta = CATEGORY_META[cat.name.toLowerCase()] || {
              icon: Layers,
              accentColor: "#B79A5A",
              tagline: "",
            };
            const Icon = meta.icon;

            const previewArt = categoryArtworksMap[cat.name]?.[0];
            const previewImgUrl = previewArt?.mainImage?.url
              ? getImageKitUrl(previewArt.mainImage.url, {
                  width: 380,
                  quality: 80,
                  format: "webp",
                })
              : null;

            return (
              <button
                key={cat._id || `cat-${idx}`}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                aria-pressed={isSelected}
                className="group relative flex flex-col items-center focus:outline-none transition-transform duration-300 hover:-translate-y-1 cursor-pointer w-full"
              >
                <div className="relative w-full aspect-[1/1.05] max-w-[180px] mx-auto filter drop-shadow-[0_4px_10px_rgba(38,50,72,0.10)] sm:drop-shadow-[0_8px_18px_rgba(38,50,72,0.12)] group-hover:drop-shadow-[0_10px_20px_rgba(183,154,90,0.28)] transition-all duration-300">
                  <svg
                    viewBox="0 0 100 105"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <clipPath id={`pagePentagonClip-${idx}`}>
                        <polygon points="50,2 98,38 80,100 20,100 2,38" />
                      </clipPath>

                      <linearGradient
                        id={`pagePentagonGrad-${idx}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        {isSelected ? (
                          <>
                            <stop offset="0%" stopColor="#263248" />
                            <stop offset="100%" stopColor="#141B26" />
                          </>
                        ) : (
                          <>
                            <stop offset="0%" stopColor="#FAF7F0" />
                            <stop offset="100%" stopColor="#F0E8D6" />
                          </>
                        )}
                      </linearGradient>
                    </defs>

                    <polygon
                      points="50,2 98,38 80,100 20,100 2,38"
                      fill={`url(#pagePentagonGrad-${idx})`}
                    />

                    {previewImgUrl && (
                      <g clipPath={`url(#pagePentagonClip-${idx})`}>
                        <image
                          href={previewImgUrl}
                          x="0"
                          y="0"
                          width="100"
                          height="105"
                          preserveAspectRatio="xMidYMid slice"
                          opacity={isSelected ? "0.22" : "0.14"}
                          className="group-hover:opacity-25 transition-opacity"
                        />
                      </g>
                    )}

                    <polygon
                      points="50,2 98,38 80,100 20,100 2,38"
                      fill="none"
                      stroke={isSelected ? "#B79A5A" : "rgba(183, 154, 90, 0.45)"}
                      strokeWidth={isSelected ? "2.4" : "1.2"}
                      className="group-hover:stroke-[#B79A5A] transition-colors"
                    />

                    <polygon
                      points="50,8 92,40 76,94 24,94 8,40"
                      fill="none"
                      stroke={isSelected ? "rgba(216, 197, 148, 0.5)" : "rgba(183, 154, 90, 0.25)"}
                      strokeWidth="0.8"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5 xs:p-1 sm:p-2 md:p-3 text-center pointer-events-none">
                    <div
                      className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center mb-0.5 sm:mb-1 transition-all duration-300 ${
                        isSelected
                          ? "bg-[#B79A5A] text-[#141B26] shadow-sm scale-110"
                          : "bg-[#263248]/10 text-[#263248] group-hover:bg-[#B79A5A]/20 group-hover:text-[#B79A5A]"
                      }`}
                    >
                      <span className="hidden sm:inline">
                        <Icon size={16} />
                      </span>
                      <span className="sm:hidden">
                        <Icon size={10} />
                      </span>
                    </div>

                    <span
                      className={`font-serif text-[7.5px] xs:text-[8.5px] sm:text-[11.5px] md:text-[12.5px] font-semibold leading-[1.05] sm:leading-tight line-clamp-2 px-0.5 ${
                        isSelected ? "text-[#FAF7F0]" : "text-[#263248] group-hover:text-[#B79A5A]"
                      }`}
                    >
                      {cat.name}
                    </span>

                    <span
                      className={`text-[6.5px] xs:text-[7.5px] sm:text-[9.5px] font-sans tracking-wide uppercase font-medium mt-0.5 ${
                        isSelected ? "text-[#D8C594]" : "text-[#6B7280]"
                      }`}
                    >
                      {count} <span className="hidden xs:inline">{count === 1 ? "work" : "works"}</span>
                    </span>
                  </div>
                </div>

                <div
                  className={`mt-1 sm:mt-2 h-0.5 sm:h-1 rounded-full transition-all duration-300 ${
                    isSelected ? "w-4 sm:w-8 bg-[#B79A5A]" : "w-0 bg-transparent group-hover:w-2 sm:group-hover:w-4 group-hover:bg-[#B79A5A]/40"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* View All Works Quick Filter Toggle */}
        <div className="flex items-center justify-between border-b border-[#B79A5A]/30 pb-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#263248]">
              {selectedCategory === "All Works" ? "All Handcrafted Creations" : `Works in ${selectedCategory}`}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#4B5568] mt-0.5">
              Showing <span className="font-semibold text-[#263248]">{filteredArtworks.length}</span> artworks
            </p>
          </div>

          {selectedCategory !== "All Works" && (
            <button
              type="button"
              onClick={() => setSelectedCategory("All Works")}
              className="px-3.5 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider font-semibold bg-[#263248] text-[#FAF7F0] hover:bg-[#B79A5A] transition-colors shadow-sm"
            >
              Show All Works
            </button>
          )}
        </div>

        {/* Loading / Error / Empty / Artworks Display */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 xs:gap-3 sm:gap-5 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-[230px] xs:h-[260px] sm:h-[340px] bg-[#F4EFE4] rounded-xl sm:rounded-2xl border border-[#B79A5A]/20"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border border-[#B79A5A]/30 max-w-lg mx-auto space-y-4">
            <AlertCircle size={32} className="text-[#B79A5A] mx-auto" />
            <h3 className="text-lg font-serif text-[#263248]">Collection Unavailable</h3>
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
          <div className="p-10 sm:p-16 text-center rounded-2xl bg-white/70 border border-[#B79A5A]/25 max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#B79A5A]/40 flex items-center justify-center text-[#B79A5A] mx-auto">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-serif text-[#263248] font-normal">
              No Creations in &quot;{selectedCategory}&quot; Yet
            </h3>
            <p className="text-xs font-sans text-[#4B5568] leading-relaxed max-w-md mx-auto">
              The artist is currently handcrafting works for this category. Return soon or explore all works.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory("All Works")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#263248] hover:bg-[#B79A5A] text-[#FAF7F0] text-xs font-sans uppercase tracking-wider font-semibold transition-colors"
            >
              View All Works
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 xs:gap-3.5 sm:gap-5 lg:gap-6">
            {filteredArtworks.map((art) => (
              <article
                key={art._id}
                onClick={() => handleArtworkClick(art)}
                className="group cursor-pointer relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#F9F5ED] border border-[#B79A5A]/30 hover:border-[#B79A5A] transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 sm:hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div className="relative w-full h-[140px] xs:h-[175px] sm:h-[260px] overflow-hidden bg-[#FAF7F0] flex items-center justify-center p-2 sm:p-3">
                  <img
                    src={getImageKitUrl(art.mainImage?.url, {
                      width: 700,
                      quality: 88,
                      format: "webp",
                    })}
                    alt={art.mainImage?.alt || art.title}
                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-[#B79A5A]/40 rounded-tr-md pointer-events-none group-hover:border-[#B79A5A] transition-colors" />
                </div>

                <div className="p-2.5 xs:p-3 sm:p-5 bg-[#F9F5ED] border-t border-[#B79A5A]/20 flex flex-col justify-between gap-1.5 sm:gap-3 flex-1">
                  <div>
                    <span className="text-[8px] sm:text-[9px] font-sans tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#B79A5A] font-semibold block mb-0.5 sm:mb-1 truncate">
                      {art.category}
                    </span>
                    <h4 className="text-xs xs:text-sm sm:text-lg font-serif text-[#263248] font-normal leading-tight sm:leading-snug group-hover:text-[#B79A5A] transition-colors line-clamp-1">
                      {art.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-[#B79A5A]/15 mt-auto">
                    <div>
                      <span className="text-[7.5px] sm:text-[9px] font-sans text-[#718096] uppercase tracking-wider block">
                        Price
                      </span>
                      <p className="text-xs xs:text-sm sm:text-base font-serif font-bold text-[#263248]">
                        ₹{art.priceINR.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <AddToCartButton artwork={art} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </main>

      <Footer />

      <ArtworkDetailModal
        artwork={activeArtwork}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveArtwork(null);
        }}
        onSelectCategory={(catName) => setSelectedCategory(catName)}
      />
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F4EA]" />}>
      <CollectionsContent />
    </Suspense>
  );
}
