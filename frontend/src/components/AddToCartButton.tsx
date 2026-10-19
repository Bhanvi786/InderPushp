"use client";

import React, { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { Artwork } from "../types/artwork";
import { useCart } from "../context/CartContext";

interface AddToCartButtonProps {
  artwork: Artwork;
  className?: string;
  isAddedExternal?: boolean;
}

export default function AddToCartButton({ artwork, className = "", isAddedExternal }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [internalAdded, setInternalAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isAdded = isAddedExternal !== undefined ? isAddedExternal : internalAdded;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Prevent rapid duplicate clicks while handling
    if (isProcessing || isAdded) return;

    setIsProcessing(true);
    addItem(artwork, 1);
    setInternalAdded(true);

    setTimeout(() => {
      setInternalAdded(false);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isProcessing}
      aria-label={`Add ${artwork.title} to Cart`}
      className={`relative inline-flex items-center justify-center p-2 sm:px-3.5 sm:py-2 sm:gap-1.5 rounded-full font-sans text-xs tracking-wider uppercase font-semibold transition-all duration-300 shadow-md active:scale-95 cursor-pointer backdrop-blur-md select-none shrink-0 ${
        isAdded
          ? "bg-[#263248]/90 text-[#FAF7F0] border border-[#B79A5A] animate-gold-glow"
          : "bg-black/45 hover:bg-black/70 text-white hover:text-white border border-white/35 hover:border-white/60"
      } ${className}`}
    >
      {isAdded ? (
        <>
          <Check size={14} className="text-[#D8C594] animate-scale-in" strokeWidth={2.5} />
          <span className="hidden sm:inline text-[#FAF7F0] tracking-widest text-[11px] sm:text-xs">ADDED</span>
        </>
      ) : (
        <>
          <ShoppingBag size={14} className="text-white group-hover:scale-110 transition-transform" strokeWidth={1.75} />
          <span className="hidden sm:inline tracking-widest text-[11px] sm:text-xs">ADD</span>
        </>
      )}
    </button>
  );
}
