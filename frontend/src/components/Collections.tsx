"use client";
import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Flower2,
  Compass,
  Palette,
  Frame,
  Home as HomeIcon,
  Layers,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Artwork, Category } from "../types/artwork";
import { artworksApi, categoriesApi, DEFAULT_CATEGORIES } from "../lib/api";
import { getImageKitUrl } from "../lib/imagekit";
import { useCart } from "../context/CartContext";
import ArtworkDetailModal from "./ArtworkDetailModal";
import AddToCartButton from "./AddToCartButton";
import AllWorksPerspectiveCarousel from "./AllWorksPerspectiveCarousel";
import MosaicBorderDivider from "./MosaicBorderDivider";

// Metadata icons and subtle styling accents for each of the 6 categories
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
    tagline: "Botanical blossoms, foliage & wildlife",
  },
  "figurative & spiritual": {
    icon: Compass,
    accentColor: "#934A5F",
    tagline: "Sacred portraits, Krishna & devotion",
  },
  "abstract & geometric": {
    icon: Palette,
    accentColor: "#3B5998",
    tagline: "Rhythmic patterns & modern tesserae",
  },
  "decorative art": {
    icon: Frame,
    accentColor: "#B79A5A",
    tagline: "Mirrors, frames & functional beauty",
  },
  "art for spaces": {
    icon: HomeIcon,
    accentColor: "#6A4C93",
    tagline: "Architectural installations & murals",
  },
  other: {
    icon: Sparkles,
    accentColor: "#52796F",
    tagline: "Unique studio creations & experiments",
  },
};

export default function Collections() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal state (for 3D carousel items on homepage)
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Cart integration
  const { addItem } = useCart();

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

  // Navigate to dedicated collections page on category click
  const handleCategorySelect = (categoryName: string) => {
    router.push(`/collections?category=${encodeURIComponent(categoryName)}`);
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setActiveArtwork(artwork);
    setModalOpen(true);
  };

  return (
    <section
      id="collections"
      className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 xl:px-16 bg-[#FAF7F0] relative overflow-hidden text-[#263248]"
    >
      {/* ======================================================== */}
      {/* 3D PERSPECTIVE CAROUSEL (Directly below Hero)            */}
      {/* ======================================================== */}
      {!loading && !error && artworks.length > 0 && (
        <>
          <div className="relative z-10 w-full mb-4 sm:mb-6">
            <AllWorksPerspectiveCarousel
              artworks={artworks}
              onArtworkClick={handleArtworkClick}
            />
          </div>
          {/* Edge-to-edge thin wavy mosaic border divider */}
          <div className="relative z-10 w-screen -mx-4 sm:-mx-6 md:-mx-12 xl:-mx-16 mb-12 sm:mb-16 overflow-hidden pointer-events-none select-none">
            <MosaicBorderDivider />
          </div>
        </>
      )}

      <div className="max-w-[1360px] mx-auto relative z-10">
        {/* ======================================================== */}
        {/* EDITORIAL SECTION HEADER                                 */}
        {/* ======================================================== */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="w-6 h-[1.5px] bg-[#B79A5A]" />
            <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-semibold">
              CURATED CATEGORIES
            </span>
            <span className="w-6 h-[1.5px] bg-[#B79A5A]" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#263248] tracking-tight font-normal leading-tight">
            Explore Handcrafted Collections
          </h2>

          <p className="text-[#4B5568] text-xs sm:text-sm font-sans mt-2 leading-relaxed">
            Select any category below to explore dedicated mosaic artworks created in our studio.
          </p>
        </div>

        {/* ======================================================== */}
        {/* 6 CATEGORY SHAPES IN A SINGLE ROW (ALL SCREEN SIZES)     */}
        {/* ======================================================== */}
        <div className="grid grid-cols-6 gap-1 xs:gap-1.5 sm:gap-3 md:gap-4 lg:gap-5 mb-10 sm:mb-14 px-0">
          {displayCategories.map((cat, idx) => {
            const count = categoryArtworksMap[cat.name]?.length || 0;
            const meta = CATEGORY_META[cat.name.toLowerCase()] || {
              icon: Layers,
              accentColor: "#B79A5A",
              tagline: cat.description || "Handcrafted mosaic art",
            };
            const Icon = meta.icon;

            // Representative thumbnail for preview background
            const previewArt = categoryArtworksMap[cat.name]?.[0];
            const previewImgUrl = previewArt?.mainImage?.url
              ? getImageKitUrl(previewArt.mainImage.url, {
                  width: 380,
                  quality: 80,
                  format: "webp",
                })
              : null;

            return (
              <Link
                key={cat._id || `cat-${idx}`}
                href={`/collections?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col items-center focus:outline-none transition-transform duration-300 hover:-translate-y-1 cursor-pointer w-full"
              >
                {/* SVG Shape Container with Gold Trim */}
                <div className="relative w-full aspect-[1/1.05] max-w-[190px] mx-auto filter drop-shadow-[0_4px_10px_rgba(38,50,72,0.10)] sm:drop-shadow-[0_8px_18px_rgba(38,50,72,0.12)] group-hover:drop-shadow-[0_10px_20px_rgba(183,154,90,0.28)] transition-all duration-300">
                  <svg
                    viewBox="0 0 100 105"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <clipPath id={`pentagonClip-${idx}`}>
                        <polygon points="50,2 98,38 80,100 20,100 2,38" />
                      </clipPath>

                      <linearGradient
                        id={`pentagonGrad-${idx}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#FAF7F0" />
                        <stop offset="100%" stopColor="#F0E8D6" />
                      </linearGradient>
                    </defs>

                    {/* Pentagon Base Fill */}
                    <polygon
                      points="50,2 98,38 80,100 20,100 2,38"
                      fill={`url(#pentagonGrad-${idx})`}
                    />

                    {/* Image Fill with Opacity for Mosaic Texture */}
                    {previewImgUrl && (
                      <g clipPath={`url(#pentagonClip-${idx})`}>
                        <image
                          href={previewImgUrl}
                          x="0"
                          y="0"
                          width="100"
                          height="105"
                          preserveAspectRatio="xMidYMid slice"
                          opacity="0.16"
                          className="group-hover:opacity-25 transition-opacity"
                        />
                      </g>
                    )}

                    {/* Outer Gold Stroke */}
                    <polygon
                      points="50,2 98,38 80,100 20,100 2,38"
                      fill="none"
                      stroke="rgba(183, 154, 90, 0.55)"
                      strokeWidth="1.4"
                      className="group-hover:stroke-[#B79A5A] group-hover:stroke-[2] transition-all"
                    />

                    {/* Inner Delicate Concentric Line */}
                    <polygon
                      points="50,8 92,40 76,94 24,94 8,40"
                      fill="none"
                      stroke="rgba(183, 154, 90, 0.3)"
                      strokeWidth="0.8"
                    />
                  </svg>

                  {/* Content Positioned Inside the Shape */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5 xs:p-1 sm:p-2 md:p-3 text-center pointer-events-none">
                    {/* Icon Bubble */}
                    <div className="w-4 h-4 xs:w-5 xs:h-5 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center mb-0.5 sm:mb-1 transition-all duration-300 bg-[#263248]/10 text-[#263248] group-hover:bg-[#B79A5A] group-hover:text-white group-hover:scale-105">
                      <span className="hidden sm:inline">
                        <Icon size={16} />
                      </span>
                      <span className="sm:hidden">
                        <Icon size={10} />
                      </span>
                    </div>

                    {/* Category Title Inside */}
                    <span className="font-serif text-[7.5px] xs:text-[8.5px] sm:text-[11.5px] md:text-[12.5px] font-semibold leading-[1.05] sm:leading-tight line-clamp-2 px-0.5 text-[#263248] group-hover:text-[#B79A5A] transition-colors">
                      {cat.name}
                    </span>

                    {/* Artwork Count Badge */}
                    <span className="text-[6.5px] xs:text-[7.5px] sm:text-[9.5px] font-sans tracking-wide uppercase font-medium mt-0.5 text-[#6B7280]">
                      {count} <span className="hidden xs:inline">{count === 1 ? "work" : "works"}</span>
                    </span>
                  </div>
                </div>

                {/* Subtle Hover Bar Under Category */}
                <div className="mt-1 sm:mt-2 h-0.5 sm:h-1 rounded-full w-0 bg-transparent group-hover:w-3 sm:group-hover:w-5 group-hover:bg-[#B79A5A] transition-all duration-300" />
              </Link>
            );
          })}
        </div>

        {/* Call-to-action button to view all works on the dedicated collections page */}
        <div className="text-center mt-2 mb-6">
          <Link
            href="/collections?category=All%20Works"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold bg-[#263248] text-[#FAF7F0] hover:bg-[#B79A5A] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Explore All Masterworks</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DETAILED ARTWORK MODAL (for Carousel interaction)        */}
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
