"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, ShieldCheck, Sparkles, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { getImageKitUrl } from '../lib/imagekit';

export default function CartPageComponent() {
  const { items, totalCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    specialInstructions: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Please enter at least 2 characters';
        return '';
      case 'phone': {
        const cleanPhone = value.replace(/[\s\-\+\(\)]/g, '');
        if (!value.trim()) return 'WhatsApp / mobile number is required';
        if (cleanPhone.length < 10) return 'Please enter a valid 10-digit phone number';
        if (!/^\d+$/.test(cleanPhone)) return 'Please enter numbers only';
        return '';
      }
      case 'address':
        if (!value.trim()) return 'Delivery address is required';
        if (value.trim().length < 5) return 'Please provide full house/flat and street address';
        return '';
      case 'city':
        if (!value.trim()) return 'City / Town is required';
        return '';
      case 'state':
        if (!value.trim()) return 'State is required';
        return '';
      case 'pincode': {
        const cleanPin = value.trim();
        if (!cleanPin) return 'PIN code is required';
        if (!/^\d{6}$/.test(cleanPin)) return 'Please enter a valid 6-digit PIN code';
        return '';
      }
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required fields
    const errors: Record<string, string> = {
      fullName: validateField('fullName', formData.fullName),
      phone: validateField('phone', formData.phone),
      address: validateField('address', formData.address),
      city: validateField('city', formData.city),
      state: validateField('state', formData.state),
      pincode: validateField('pincode', formData.pincode),
    };

    setTouchedFields({
      fullName: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
    });

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((err) => Boolean(err));
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);

    const itemsSummary = items
      .map((item, idx) => `${idx + 1}. *${item.title}* (Qty: ${item.quantity}) - ₹${(item.priceINR * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const message = `*New Order Request - InderPushp House of Art*

*Customer Details:*
• *Name:* ${formData.fullName}
• *Phone:* ${formData.phone}
• *Address:* ${formData.address}
• *City / Town:* ${formData.city}
• *State:* ${formData.state}
• *PIN Code:* ${formData.pincode}${formData.specialInstructions ? `\n• *Landmark / Notes:* ${formData.specialInstructions}` : ''}

*Order Summary:*
${itemsSummary}

*Total Valuation:* ₹${subtotal.toLocaleString('en-IN')}
*Shipping:* Standard Studio Shipping (To be confirmed)

Please confirm my order and share payment / delivery schedule. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919911145052?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setCheckoutStep('success');
      clearCart();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#263248] flex flex-col">
      <Header />

      <main className="flex-1 pt-28 sm:pt-32 pb-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-7xl mx-auto w-full">
        {checkoutStep === 'success' ? (
          /* Order Placement Confirmation Entry Point */
          <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 sm:p-12 border border-[#B79A5A]/30 shadow-xl text-center space-y-6 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-semibold block mb-1">
                Order Received
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#263248] font-bold">
                Thank you for your order!
              </h1>
              <p className="text-xs sm:text-sm font-sans text-[#4B5568] mt-2 leading-relaxed">
                We have received your order details. We will reach out to you on WhatsApp at <strong className="text-[#263248]">{formData.phone || 'your number'}</strong> to confirm your artwork, share photos, and arrange safe delivery.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#B79A5A]/20 text-xs font-sans text-left space-y-2.5">
              <div className="flex justify-between">
                <span className="text-[#4B5568]">Name:</span>
                <span className="font-semibold text-[#263248]">{formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5568]">Deliver To:</span>
                <span className="font-semibold text-[#263248]">{formData.city}, {formData.pincode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5568]">Confirmation:</span>
                <span className="font-semibold text-[#B79A5A]">Via WhatsApp / Call</span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#263248] hover:bg-[#384055] text-[#FAF7F0] font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Return to Gallery
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : items.length === 0 && checkoutStep === 'cart' ? (
          /* Empty Cart State */
          <div className="my-16 max-w-md mx-auto text-center space-y-5 animate-fade-up">
            <div className="w-24 h-24 rounded-full bg-white border border-[#B79A5A]/30 text-[#B79A5A] mx-auto flex items-center justify-center shadow-xs">
              <ShoppingBag size={40} />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-semibold block">
                InderPushp Atelier
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#263248] font-normal">
                Your collection begins here
              </h1>
              <p className="text-xs sm:text-sm font-sans text-[#4B5568] leading-relaxed">
                There are no mosaic pieces currently in your cart. Explore our handcrafted creations and select the works that speak to you.
              </p>
            </div>

            <Link
              href="/#collections"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#263248] hover:bg-[#B79A5A] text-[#FAF7F0] font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-95"
            >
              Explore Artworks
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          /* Active Cart / Checkout Content */
          <div className="space-y-8 animate-fade-up">
            {/* Top Bar Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#B79A5A]/20">
              <div className="space-y-1">
                <span className="text-[11px] font-sans tracking-[0.28em] uppercase text-[#B79A5A] font-semibold block">
                  {checkoutStep === 'cart' ? 'Your Bag' : 'Your Order'}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#263248] font-normal tracking-tight">
                  {checkoutStep === 'cart' ? 'Shopping Cart' : 'Complete Your Order'}
                </h1>
              </div>

              <div className="flex items-center gap-5 text-xs font-sans">
                {checkoutStep === 'checkout' && (
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="inline-flex items-center gap-1.5 text-[#4B5568] hover:text-[#B79A5A] transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    Back to Cart
                  </button>
                )}
                <Link
                  href="/#collections"
                  className="inline-flex items-center gap-1.5 text-[#4B5568] hover:text-[#B79A5A] transition-colors"
                >
                  <ArrowLeft size={14} />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Split Grid: Items / Checkout Form on Left, Order Summary on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* LEFT COLUMN: Cart Items or Checkout Form */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                {checkoutStep === 'cart' ? (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-5 sm:p-6 border border-[#B79A5A]/25 shadow-xs flex flex-col sm:flex-row items-center gap-5 sm:gap-6 transition-all hover:border-[#B79A5A]/45 hover:shadow-sm"
                      >
                        {/* Artwork Image uncropped */}
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-[#FAF7F0] border border-[#B79A5A]/25 relative overflow-hidden shrink-0 flex items-center justify-center p-2">
                          {item.imageUrl ? (
                            <Image
                              src={getImageKitUrl(item.imageUrl, { width: 300, quality: 90 })}
                              alt={item.title}
                              fill
                              className="object-contain p-2"
                              sizes="128px"
                            />
                          ) : (
                            <span className="text-xs text-[#4B5568]">No Image</span>
                          )}
                        </div>

                        {/* Title, Category & Specs */}
                        <div className="flex-1 min-w-0 w-full flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base sm:text-lg font-serif text-[#263248] font-medium leading-snug">
                                {item.title}
                              </h3>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              aria-label={`Remove ${item.title}`}
                              className="p-2 text-[#4B5568]/60 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Remove from cart"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          {/* Quantity & Item Subtotal */}
                          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#B79A5A]/15">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-sans text-[#4B5568]">Quantity:</span>
                              <div className="flex items-center border border-[#B79A5A]/30 rounded-lg bg-[#FAF7F0] overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-2.5 py-1 text-[#263248] hover:bg-[#B79A5A] hover:text-white transition-colors"
                                  title="Decrease quantity"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="px-3 text-xs font-sans font-semibold text-[#263248]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-2.5 py-1 text-[#263248] hover:bg-[#B79A5A] hover:text-white transition-colors"
                                  title="Increase quantity"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-base sm:text-lg font-serif font-bold text-[#263248]">
                                ₹{(item.priceINR * item.quantity).toLocaleString('en-IN')}
                              </span>
                              {item.quantity > 1 && (
                                <span className="block text-[11px] text-[#4B5568]">
                                  ₹{item.priceINR.toLocaleString('en-IN')} each
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Luxury Gallery Delivery Form */
                  <form
                    onSubmit={handleCheckoutSubmit}
                    className="bg-white rounded-2xl p-6 sm:p-9 border border-[#B79A5A]/30 shadow-xs space-y-7"
                  >
                    <div className="border-b border-[#B79A5A]/20 pb-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl sm:text-2xl font-serif text-[#263248] font-normal tracking-tight">
                          Shipping & Delivery Details
                        </h2>
                        <span className="text-[11px] font-sans text-[#B79A5A] tracking-wider uppercase hidden sm:inline-block">
                          Direct Studio Delivery
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-sans text-[#4B5568] mt-1.5 leading-relaxed">
                        Please provide your destination details below so Master Artist Geetu Jaidka can safely prepare and dispatch your handcrafted mosaic works.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Row 1: Full Name & WhatsApp/Mobile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-sans font-medium text-[#263248] mb-1.5">
                            Full Name <span className="text-[#B8542A]">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="e.g. Geetu Jaidka"
                            className={`w-full px-4 py-3 text-sm font-sans bg-[#FAF7F0] border rounded-xl text-[#263248] placeholder-[#9CA3AF] focus:outline-hidden focus:bg-white focus:ring-1 transition-all ${
                              touchedFields.fullName && formErrors.fullName
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                                : 'border-[#B79A5A]/30 focus:border-[#B79A5A] focus:ring-[#B79A5A]/30'
                            }`}
                          />
                          {touchedFields.fullName && formErrors.fullName && (
                            <p className="text-[11px] font-sans text-rose-600 mt-1">
                              {formErrors.fullName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium text-[#263248] mb-1.5">
                            WhatsApp / Mobile Number <span className="text-[#B8542A]">*</span>
                          </label>
                          <input
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="+91 98765 43210"
                            className={`w-full px-4 py-3 text-sm font-sans bg-[#FAF7F0] border rounded-xl text-[#263248] placeholder-[#9CA3AF] focus:outline-hidden focus:bg-white focus:ring-1 transition-all ${
                              touchedFields.phone && formErrors.phone
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                                : 'border-[#B79A5A]/30 focus:border-[#B79A5A] focus:ring-[#B79A5A]/30'
                            }`}
                          />
                          {touchedFields.phone && formErrors.phone && (
                            <p className="text-[11px] font-sans text-rose-600 mt-1">
                              {formErrors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Street Address */}
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#263248] mb-1.5">
                          Street Address / Flat / Building <span className="text-[#B8542A]">*</span>
                        </label>
                        <input
                          required
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder="e.g. Flat 402, Lotus Residency, 4th Main Road"
                          className={`w-full px-4 py-3 text-sm font-sans bg-[#FAF7F0] border rounded-xl text-[#263248] placeholder-[#9CA3AF] focus:outline-hidden focus:bg-white focus:ring-1 transition-all ${
                            touchedFields.address && formErrors.address
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                              : 'border-[#B79A5A]/30 focus:border-[#B79A5A] focus:ring-[#B79A5A]/30'
                          }`}
                        />
                        {touchedFields.address && formErrors.address && (
                          <p className="text-[11px] font-sans text-rose-600 mt-1">
                            {formErrors.address}
                          </p>
                        )}
                      </div>

                      {/* Row 3: City, State & PIN Code */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-sans font-medium text-[#263248] mb-1.5">
                            City / Town <span className="text-[#B8542A]">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="e.g. Mumbai"
                            className={`w-full px-4 py-3 text-sm font-sans bg-[#FAF7F0] border rounded-xl text-[#263248] placeholder-[#9CA3AF] focus:outline-hidden focus:bg-white focus:ring-1 transition-all ${
                              touchedFields.city && formErrors.city
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                                : 'border-[#B79A5A]/30 focus:border-[#B79A5A] focus:ring-[#B79A5A]/30'
                            }`}
                          />
                          {touchedFields.city && formErrors.city && (
                            <p className="text-[11px] font-sans text-rose-600 mt-1">
                              {formErrors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium text-[#263248] mb-1.5">
                            State <span className="text-[#B8542A]">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="e.g. Maharashtra"
                            className={`w-full px-4 py-3 text-sm font-sans bg-[#FAF7F0] border rounded-xl text-[#263248] placeholder-[#9CA3AF] focus:outline-hidden focus:bg-white focus:ring-1 transition-all ${
                              touchedFields.state && formErrors.state
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                                : 'border-[#B79A5A]/30 focus:border-[#B79A5A] focus:ring-[#B79A5A]/30'
                            }`}
                          />
                          {touchedFields.state && formErrors.state && (
                            <p className="text-[11px] font-sans text-rose-600 mt-1">
                              {formErrors.state}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium text-[#263248] mb-1.5">
                            PIN Code (6 digits) <span className="text-[#B8542A]">*</span>
                          </label>
                          <input
                            required
                            type="text"
                            name="pincode"
                            maxLength={6}
                            value={formData.pincode}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="e.g. 400001"
                            className={`w-full px-4 py-3 text-sm font-sans bg-[#FAF7F0] border rounded-xl text-[#263248] placeholder-[#9CA3AF] focus:outline-hidden focus:bg-white focus:ring-1 transition-all ${
                              touchedFields.pincode && formErrors.pincode
                                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                                : 'border-[#B79A5A]/30 focus:border-[#B79A5A] focus:ring-[#B79A5A]/30'
                            }`}
                          />
                          {touchedFields.pincode && formErrors.pincode && (
                            <p className="text-[11px] font-sans text-rose-600 mt-1">
                              {formErrors.pincode}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Row 4: Landmark / Special Instructions */}
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#263248] mb-1.5">
                          Landmark / Special Instructions <span className="text-[#4B5568]/60 font-normal">(Optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          name="specialInstructions"
                          value={formData.specialInstructions}
                          onChange={handleInputChange}
                          placeholder="Mention any nearby landmark, preferred courier timing, or custom framing notes..."
                          className="w-full px-4 py-3 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-xl text-[#263248] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#B79A5A] focus:bg-white focus:ring-1 focus:ring-[#B79A5A]/30 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="pt-4 border-t border-[#B79A5A]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('cart')}
                        className="text-xs font-sans text-[#4B5568] hover:text-[#B79A5A] transition-colors order-2 sm:order-1 inline-flex items-center gap-1.5"
                      >
                        <ArrowLeft size={13} />
                        Modify Artwork Selection
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#263248] hover:bg-[#384055] text-[#FAF7F0] font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 order-1 sm:order-2 cursor-pointer border border-[#B79A5A]/30"
                      >
                        <Sparkles size={14} className="text-[#B79A5A]" />
                        {isSubmitting ? 'Formatting Order...' : 'Confirm Order on WhatsApp'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* RIGHT COLUMN: Premium Gallery Order Summary */}
              <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl p-6 sm:p-7 border border-[#B79A5A]/30 shadow-xs space-y-5 sticky top-28">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#B79A5A]/20">
                  <h3 className="text-xl font-serif text-[#263248] font-normal tracking-tight">
                    Order Summary
                  </h3>
                  <span className="text-xs font-sans font-medium text-[#4B5568]">
                    {totalCount} {totalCount === 1 ? 'creation' : 'creations'}
                  </span>
                </div>

                {/* Selected Artwork List with Thumbnails */}
                {items.length > 0 && (
                  <div className="space-y-3 pb-3 border-b border-[#B79A5A]/15 max-h-60 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[#FAF7F0] border border-[#B79A5A]/25 relative overflow-hidden shrink-0 flex items-center justify-center p-1">
                          {item.imageUrl ? (
                            <Image
                              src={getImageKitUrl(item.imageUrl, { width: 120, quality: 85 })}
                              alt={item.title}
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          ) : (
                            <span className="text-[10px] text-[#4B5568]">Art</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-serif text-[#263248] truncate font-medium">
                            {item.title}
                          </p>
                          <p className="text-[11px] font-sans text-[#4B5568]/80">
                            Qty: {item.quantity} × ₹{item.priceINR.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <span className="text-xs font-serif text-[#263248] font-semibold shrink-0">
                          ₹{(item.priceINR * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotals & Shipping */}
                <div className="space-y-3 font-sans text-sm">
                  <div className="flex justify-between items-center text-[#4B5568]">
                    <span>Subtotal</span>
                    <span className="font-serif text-[#263248] text-base font-semibold">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[#4B5568]">
                    <span>Shipping</span>
                    <span className="text-xs text-[#4B5568]">Calculated on order</span>
                  </div>
                </div>

                {/* Final Total with Elegant Golden Accent */}
                <div className="border-t border-[#B79A5A]/25 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-serif text-[#263248] font-normal">Total</span>
                    <span className="text-2xl font-serif font-bold text-[#B79A5A]">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-[#4B5568]/70 mt-1">
                    Handcrafted in India • Direct Studio Provenance
                  </p>
                </div>

                {/* Cart Step CTA button */}
                {checkoutStep === 'cart' ? (
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => setCheckoutStep('checkout')}
                      className="w-full py-3.5 px-6 rounded-full bg-[#263248] hover:bg-[#384055] text-[#FAF7F0] font-sans text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer border border-[#B79A5A]/30"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={14} />
                    </button>

                    <p className="text-center text-[11px] font-sans text-[#4B5568]/80">
                      Orders are confirmed by Call or WhatsApp.
                    </p>
                  </div>
                ) : null}

                {/* Return / Continue Shopping link */}
                <div className="pt-2 text-center border-t border-[#B79A5A]/15">
                  <Link
                    href="/#collections"
                    className="inline-block text-xs font-sans text-[#4B5568] hover:text-[#B79A5A] transition-colors"
                  >
                    ← Continue Exploring Collections
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
