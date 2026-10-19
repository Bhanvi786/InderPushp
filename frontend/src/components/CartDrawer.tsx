"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getImageKitUrl } from '../lib/imagekit';

export default function CartDrawer() {
  const { items, totalCount, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock background scroll when drawer is open
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1F3A]/70 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md md:max-w-lg bg-[#FAF7F0] border-l border-[#B79A5A]/30 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#B79A5A]/20 flex items-center justify-between bg-white/70 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#B79A5A]/40 flex items-center justify-center text-[#B79A5A]">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-serif text-[#263248] font-semibold">
                  Curated Acquisitions
                </h2>
                <p className="text-[11px] font-sans text-[#4B5568]">
                  {totalCount === 0
                    ? 'Cart is currently empty'
                    : `${totalCount} masterpiece${totalCount > 1 ? 's' : ''} in your cart`}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="p-2 rounded-full hover:bg-[#FAF7F0] text-[#263248] hover:text-[#B79A5A] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body: Items or Empty state */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
                <div className="w-20 h-20 rounded-full bg-white border border-[#B79A5A]/30 flex items-center justify-center text-[#B79A5A] shadow-xs">
                  <Sparkles size={32} />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h3 className="text-xl font-serif text-[#263248] font-normal">
                    Your collection begins here
                  </h3>
                  <p className="text-xs font-sans text-[#4B5568] leading-relaxed">
                    Explore our luxury handcrafted mosaics and add your chosen works to begin your acquisition.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#263248] hover:bg-[#B79A5A] text-[#FAF7F0] font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95"
                >
                  Explore Artworks
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white border border-[#B79A5A]/20 shadow-2xs hover:border-[#B79A5A]/50 transition-all flex gap-4 items-center"
                  >
                    {/* Uncropped Artwork Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-[#FAF7F0] border border-[#B79A5A]/25 relative overflow-hidden shrink-0 flex items-center justify-center p-1">
                      {item.imageUrl ? (
                        <Image
                          src={getImageKitUrl(item.imageUrl, { width: 200, quality: 85 })}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                          sizes="96px"
                        />
                      ) : (
                        <span className="text-[10px] text-[#4B5568]">No Image</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-[#B79A5A] font-medium block">
                              {item.category}
                            </span>
                            <h4 className="text-sm font-serif font-medium text-[#263248] truncate leading-tight mt-0.5">
                              {item.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.title}`}
                            className="text-[#4B5568]/60 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {item.dimensions && (
                          <p className="text-[10px] font-sans text-[#4B5568] mt-0.5">
                            {item.dimensions}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#B79A5A]/10 mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#B79A5A]/30 rounded-lg bg-[#FAF7F0] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="px-2 py-1 text-[#263248] hover:bg-[#B79A5A] hover:text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-sans font-semibold text-[#263248]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="px-2 py-1 text-[#263248] hover:bg-[#B79A5A] hover:text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price Subtotal */}
                        <div className="text-right">
                          <div className="text-xs font-serif font-bold text-[#263248]">
                            ₹{(item.priceINR * item.quantity).toLocaleString('en-IN')}
                          </div>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-[#4B5568]">
                              ₹{item.priceINR.toLocaleString('en-IN')} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with totals and action buttons */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#B79A5A]/25 space-y-4">
              {/* Value Breakdown */}
              <div className="space-y-1.5 text-xs font-sans">
                <div className="flex justify-between text-[#4B5568]">
                  <span>Atelier Artworks ({totalCount})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#4B5568]">
                  <span>Studio Delivery & Insured Curation</span>
                  <span className="text-emerald-700 font-medium">Complimentary</span>
                </div>
                <div className="pt-2 border-t border-[#B79A5A]/20 flex justify-between items-baseline">
                  <span className="text-sm font-serif font-bold text-[#263248]">Estimated Total</span>
                  <span className="text-lg font-serif font-bold text-[#263248]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-3 rounded-xl bg-[#263248] hover:bg-[#384055] text-white font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} className="text-[#B79A5A]" />
                </Link>

                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full py-2.5 rounded-xl bg-transparent hover:bg-[#FAF7F0] text-[#263248] border border-[#B79A5A]/30 font-sans text-xs uppercase tracking-wider font-medium transition-colors"
                >
                  Continue Browsing
                </button>
              </div>

              {/* Authenticity guarantee pledge */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#4B5568] pt-1">
                <ShieldCheck size={13} className="text-[#B79A5A]" />
                <span>Certificate of authenticity included with each piece</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
