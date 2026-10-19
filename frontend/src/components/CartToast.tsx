"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getImageKitUrl } from "../lib/imagekit";

export default function CartToast() {
  const { toastNotification, dismissToast } = useCart();

  if (!toastNotification) return null;

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 animate-fade-up pointer-events-auto"
    >
      <div className="bg-[#263248]/95 backdrop-blur-md text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-[#B79A5A]/40 flex items-center gap-3.5 max-w-sm sm:max-w-md">
        {/* Checkmark icon with golden circle */}
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
          <Check size={16} strokeWidth={2.5} className="animate-scale-in" />
        </div>

        {/* Thumbnail preview if available */}
        {toastNotification.imageUrl && (
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 relative overflow-hidden shrink-0 flex items-center justify-center">
            <Image
              src={getImageKitUrl(toastNotification.imageUrl, { width: 80, quality: 80 })}
              alt={toastNotification.artworkTitle}
              fill
              className="object-contain p-0.5"
              sizes="36px"
            />
          </div>
        )}

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[11px] font-sans text-[#D8C594] uppercase tracking-wider font-semibold">
            Artwork added to cart
          </p>
          <p className="text-xs font-serif text-white truncate font-medium">
            {toastNotification.artworkTitle}
          </p>
        </div>

        {/* Action Link to Cart */}
        <Link
          href="/cart"
          className="px-2.5 py-1 rounded-full bg-[#B79A5A] hover:bg-[#D8C594] text-[#263248] text-[11px] font-sans font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1"
        >
          <ShoppingBag size={11} />
          View
        </Link>

        {/* Close Button */}
        <button
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="p-1 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  );
}
