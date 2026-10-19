"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Sparkles, Ruler, Palette, Clock, CheckCircle2, ChevronLeft, ChevronRight, Share2, ZoomIn, ShoppingBag, Check } from 'lucide-react';
import { Artwork, ArtworkImage } from '../types/artwork';
import { getImageKitUrl } from '../lib/imagekit';
import { useCart } from '../context/CartContext';
import AddToCartButton from './AddToCartButton';

interface ArtworkDetailModalProps {
  artwork: Artwork | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
}

export default function ArtworkDetailModal({
  artwork,
  isOpen,
  onClose,
  onSelectCategory,
}: ArtworkDetailModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    setSelectedImageIndex(0);
    setIsAdded(false);
  }, [artwork]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !artwork) return null;

  // Gather all unique images (mainImage first, then additional)
  const allImages: ArtworkImage[] = [];
  if (artwork.mainImage?.url) {
    allImages.push(artwork.mainImage);
  }
  if (artwork.additionalImages && Array.isArray(artwork.additionalImages)) {
    artwork.additionalImages.forEach((img) => {
      if (img.url && !allImages.some((existing) => existing.url === img.url)) {
        allImages.push(img);
      }
    });
  }

  const currentImage = allImages[selectedImageIndex] || artwork.mainImage;

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-[#0B1F3A]/80 backdrop-blur-md animate-fade-up duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#FAF7F0] rounded-2xl shadow-2xl border border-[#B79A5A]/30 overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close artwork details"
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#FAF7F0]/90 hover:bg-white text-[#263248] hover:text-[#B79A5A] transition-all shadow-md border border-[#B79A5A]/20"
        >
          <X size={20} />
        </button>

        {/* LEFT COLUMN: Visual Presentation (Full Image + Thumbnails) */}
        <div className="w-full md:w-[58%] bg-[#F4EFE4]/60 p-4 sm:p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#B79A5A]/20">
          <div className="relative w-full aspect-4/3 sm:aspect-4/3 md:aspect-square rounded-xl overflow-hidden bg-white/70 border border-[#B79A5A]/25 shadow-inner flex items-center justify-center">
            {currentImage?.url ? (
              <Image
                src={getImageKitUrl(currentImage.url, { width: 1200, quality: 90 })}
                alt={currentImage.alt || artwork.title}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority
              />
            ) : (
              <div className="text-xs text-[#4B5568]">No image available</div>
            )}

            {/* Availability Badge Overlay */}
            <div className="absolute top-3 left-3">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase backdrop-blur-md shadow-xs ${
                  artwork.availability === 'In Stock'
                    ? 'bg-emerald-900/80 text-emerald-100 border border-emerald-400/40'
                    : artwork.availability === 'Made to Order'
                    ? 'bg-amber-900/80 text-amber-100 border border-amber-400/40'
                    : artwork.availability === 'Sold'
                    ? 'bg-rose-900/80 text-rose-100 border border-rose-400/40'
                    : 'bg-[#263248]/80 text-[#FAF7F0] border border-[#B79A5A]/40'
                }`}
              >
                {artwork.availability}
              </span>
            </div>

            {/* Image Navigation Arrows if multiple */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
                  }
                  aria-label="Previous view"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FAF7F0]/80 hover:bg-white text-[#263248] shadow-md transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
                  }
                  aria-label="Next view"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FAF7F0]/80 hover:bg-white text-[#263248] shadow-md transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Row if multiple images */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2.5 mt-4 overflow-x-auto pb-1 hide-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#B79A5A] ring-2 ring-[#B79A5A]/30 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={getImageKitUrl(img.url, { width: 140, height: 140, quality: 75 })}
                    alt={img.alt || `Angle ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="60px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Editorial Story & Specifications */}
        <div className="w-full md:w-[42%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[92vh]">
          <div className="space-y-6">
            {/* Category Eyebrow & Featured pill */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(artwork.category);
                    onClose();
                  }
                }}
                className="text-xs font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-semibold hover:underline"
              >
                {artwork.category}
              </button>
              {artwork.isFeatured && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider bg-[#B79A5A]/15 text-[#B79A5A] border border-[#B79A5A]/30">
                  <Sparkles size={11} /> Featured Work
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-serif text-[#263248] font-medium leading-tight">
              {artwork.title}
            </h2>

            {/* Price Presentation */}
            {artwork.priceINR > 0 ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-serif text-[#263248] font-semibold">
                  ₹{artwork.priceINR.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-sans text-[#4B5568] opacity-75">INR (taxes included)</span>
              </div>
            ) : (
              <div className="text-sm font-sans italic text-[#B79A5A]">
                Custom Price on Request / Exclusive Commission
              </div>
            )}

            {/* Description */}
            {artwork.description && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-sans uppercase tracking-widest text-[#263248]/70 font-semibold">
                  Story & Inspiration
                </h4>
                <p className="text-sm font-sans text-[#4B5568] leading-relaxed whitespace-pre-line">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Specifications Grid */}
            <div className="space-y-3 pt-3 border-t border-[#B79A5A]/20 text-xs font-sans">
              {artwork.dimensions && (
                <div className="flex items-start gap-3 text-[#263248]">
                  <Ruler size={16} className="text-[#B79A5A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Dimensions</span>
                    <span className="text-[#4B5568]">{artwork.dimensions}</span>
                  </div>
                </div>
              )}

              {artwork.materials && (
                <div className="flex items-start gap-3 text-[#263248]">
                  <Palette size={16} className="text-[#B79A5A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Medium & Materials</span>
                    <span className="text-[#4B5568]">{artwork.materials}</span>
                  </div>
                </div>
              )}

              {artwork.estimatedProductionTime && (
                <div className="flex items-start gap-3 text-[#263248]">
                  <Clock size={16} className="text-[#B79A5A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Crafting Time</span>
                    <span className="text-[#4B5568]">{artwork.estimatedProductionTime}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 mt-6 border-t border-[#B79A5A]/20 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-xs font-sans text-[#4B5568] hover:text-[#B79A5A] transition-colors"
            >
              <Share2 size={14} />
              <span>{copiedLink ? 'Link Copied!' : 'Share Artwork'}</span>
            </button>

            <div className="flex items-center gap-2.5">
              <AddToCartButton artwork={artwork} className="px-5 py-2.5" />

              <a
                href="/#contact"
                onClick={onClose}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-[#263248] hover:bg-[#384055] text-[#FAF7F0] font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md border border-[#B79A5A]/30"
              >
                Enquire
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
