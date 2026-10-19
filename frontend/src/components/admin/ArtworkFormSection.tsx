"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Save,
  Eye,
  ArrowLeft,
  Sparkles,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  Artwork,
  ArtworkCategory,
  AvailabilityStatus,
  ArtworkImage,
  Category,
} from '../../types/artwork';
import ArtworkImageUploader from './ArtworkImageUploader';

interface ArtworkFormSectionProps {
  initialArtwork?: Artwork | null;
  onSave: (artworkData: Partial<Artwork>) => Promise<void>;
  onCancel: () => void;
  imageKitConfigured?: boolean;
  cloudinaryConfigured?: boolean;
  availableCategories?: Category[];
}

export default function ArtworkFormSection({
  initialArtwork,
  onSave,
  onCancel,
  imageKitConfigured,
  cloudinaryConfigured,
  availableCategories = [],
}: ArtworkFormSectionProps) {
  const isEditing = Boolean(initialArtwork?._id);
  const isStorageActive = Boolean(imageKitConfigured ?? cloudinaryConfigured);

  // Form Fields
  const [title, setTitle] = useState(initialArtwork?.title || '');
  const [description, setDescription] = useState(initialArtwork?.description || '');
  const [category, setCategory] = useState<string>(
    initialArtwork?.category || (availableCategories[0]?.name || 'Floral & Nature')
  );
  const [priceINR, setPriceINR] = useState<string>(
    initialArtwork ? String(initialArtwork.priceINR) : '25000'
  );
  const [dimensions, setDimensions] = useState(initialArtwork?.dimensions || '');
  const [materials, setMaterials] = useState(
    initialArtwork?.materials || 'Hand-cut stained glass, Italian smalti, gold leaf tiles'
  );
  const [availability, setAvailability] = useState<AvailabilityStatus>(
    initialArtwork?.availability || 'In Stock'
  );
  const [stockQuantity, setStockQuantity] = useState<string>(
    initialArtwork ? String(initialArtwork.stockQuantity) : '1'
  );
  const [estimatedProductionTime, setEstimatedProductionTime] = useState(
    initialArtwork?.estimatedProductionTime || ''
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialArtwork?.isFeatured ?? false
  );
  const [isPublished, setIsPublished] = useState<boolean>(
    initialArtwork?.isPublished ?? true
  );
  const [displayOrder, setDisplayOrder] = useState<string>(
    initialArtwork?.displayOrder !== undefined ? String(initialArtwork.displayOrder) : '0'
  );

  // Images state
  const [mainImage, setMainImage] = useState<ArtworkImage | null>(
    initialArtwork?.mainImage || null
  );
  const [additionalImages, setAdditionalImages] = useState<ArtworkImage[]>(
    initialArtwork?.additionalImages || []
  );

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Auto-set production time default if Made to Order
  useEffect(() => {
    if (availability === 'Made to Order' && !estimatedProductionTime) {
      setEstimatedProductionTime('3-4 weeks handcrafted');
    }
  }, [availability, estimatedProductionTime]);

  // Dynamic categories with default fallback to the 6 core categories
  const fallbackCategories = [
    'Floral & Nature',
    'Figurative & Spiritual',
    'Abstract & Geometric',
    'Decorative Art',
    'Art for Spaces',
    'Other',
  ];

  const categoryNames = React.useMemo(() => {
    const list = availableCategories.length > 0
      ? availableCategories.map((c) => c.name)
      : [...fallbackCategories];
    if (category && !list.includes(category)) {
      list.push(category);
    }
    return list;
  }, [availableCategories, category]);

  const availabilities: AvailabilityStatus[] = [
    'In Stock',
    'Made to Order',
    'Sold',
    'Enquiry Only',
  ];

  // Submission handler
  const handleSubmit = async (publishIntent: boolean) => {
    setFormError(null);

    // Validate title
    if (!title.trim()) {
      setFormError('Artwork title is required.');
      return;
    }

    // Validate main image
    if (!mainImage || !mainImage.url) {
      setFormError('A main artwork image is required to save or publish.');
      return;
    }

    const priceNum = Number(priceINR);
    if (isNaN(priceNum) || priceNum < 0) {
      setFormError('Please enter a valid price in INR.');
      return;
    }

    const stockNum = Number(stockQuantity);

    setIsSubmitting(true);
    try {
      const payload: Partial<Artwork> = {
        title: title.trim(),
        description: description.trim(),
        category,
        priceINR: priceNum,
        mainImage,
        additionalImages,
        dimensions: dimensions.trim(),
        materials: materials.trim(),
        availability,
        stockQuantity: isNaN(stockNum) ? 1 : stockNum,
        estimatedProductionTime: estimatedProductionTime.trim(),
        isFeatured,
        isPublished: publishIntent,
        displayOrder: Number(displayOrder) || 0,
      };

      await onSave(payload);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save artwork. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-5xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-white border border-[#B79A5A]/30 text-[#263248] hover:bg-[#FAF7F0] transition-colors"
            title="Return to Artwork List"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#263248] font-semibold">
              {isEditing ? `Edit Artwork: ${initialArtwork?.title}` : 'Add New Masterpiece'}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#4B5568]">
              {isEditing
                ? 'Update listing specs, photos or catalog visibility'
                : 'Create and publish handcrafted mosaic art into the gallery'}
            </p>
          </div>
        </div>

        {/* Live Preview Button */}
        <button
          type="button"
          onClick={() => setShowPreviewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#B79A5A] text-[#263248] font-sans text-xs tracking-wider uppercase font-semibold hover:bg-[#FAF7F0] transition-colors"
        >
          <Eye size={15} className="text-[#B79A5A]" />
          Preview Public Card
        </button>
      </div>

      {/* Form Error Banner */}
      {formError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-sans flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
          <button
            onClick={() => setFormError(null)}
            className="text-xs underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Left is Form Fields, Right is Image Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Artwork Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#B79A5A]/25 space-y-5">
            <h3 className="text-sm font-serif font-semibold text-[#263248] uppercase tracking-wider pb-3 border-b border-[#FAF7F0]">
              Piece Information
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                Artwork Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Royal Lotus in Bloom"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                Artistic Story & Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe the mosaic craftsmanship, inspiration, color interplay..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                  Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                >
                  {categoryNames.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                  Price in INR (₹) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-serif font-bold text-[#B79A5A]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    placeholder="25000"
                    value={priceINR}
                    onChange={(e) => setPriceINR(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                  />
                </div>
              </div>
            </div>

            {/* Dimensions & Materials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                  Dimensions
                </label>
                <input
                  type="text"
                  placeholder='e.g., 24" x 36" (60 x 90 cm)'
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0 (Lower shows first)"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                Materials & Technique
              </label>
              <input
                type="text"
                placeholder="e.g., Stained Glass, Italian Smalti, Metallic Ceramic, Birch Wood Board"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
              />
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#B79A5A]/25 space-y-4">
            <h3 className="text-sm font-serif font-semibold text-[#263248] uppercase tracking-wider pb-3 border-b border-[#FAF7F0]">
              Availability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                  Availability Status <span className="text-rose-600">*</span>
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
                  className="w-full px-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                >
                  {availabilities.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                  Stock Units (If In Stock)
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  disabled={availability === 'Sold' || availability === 'Enquiry Only'}
                  className="w-full px-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] disabled:opacity-50 focus:outline-hidden focus:border-[#B79A5A]"
                />
              </div>
            </div>

            {availability === 'Made to Order' && (
              <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200">
                <label className="block text-xs font-sans font-semibold text-sky-900 mb-1">
                  Estimated Production Time for Commissions
                </label>
                <input
                  type="text"
                  placeholder="e.g., 3-4 weeks for custom assembly"
                  value={estimatedProductionTime}
                  onChange={(e) => setEstimatedProductionTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-sans bg-white border border-sky-300 rounded-md text-sky-950 focus:outline-hidden"
                />
              </div>
            )}

            {(availability === 'Sold' || availability === 'Enquiry Only') && (
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-sans text-amber-900 flex items-start gap-2">
                <HelpCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Notice: As requested, this piece will not be presented as immediately
                  purchasable. Patrons will only be able to submit bespoke commission inquiries.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: ImageKit Image Uploader (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#B79A5A]/25">
            <h3 className="text-sm font-serif font-semibold text-[#263248] uppercase tracking-wider pb-3 border-b border-[#FAF7F0] mb-4">
              Media Upload
            </h3>

            <ArtworkImageUploader
              mainImage={mainImage}
              onMainImageChange={setMainImage}
              additionalImages={additionalImages}
              onAdditionalImagesChange={setAdditionalImages}
              imageKitConfigured={isStorageActive}
            />
          </div>

          {/* Action buttons: Save Draft vs Publish */}
          <div className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#B79A5A]/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-sans text-[#4B5568] mb-2">
              <span>Status to apply:</span>
              <span className="font-semibold text-[#263248]">
                {isPublished ? 'Live Publication' : 'Draft Only'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(true)}
                className="w-full py-3 rounded-xl bg-[#263248] hover:bg-[#384055] text-white font-sans text-xs tracking-wider uppercase font-semibold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles size={15} className="text-[#B79A5A]" />
                {isSubmitting ? 'Saving...' : 'Publish to Gallery'}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit(false)}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-[#F4EFE4] text-[#263248] border border-[#B79A5A]/40 font-sans text-xs tracking-wider uppercase font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={14} />
                Save as Draft
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2 text-[#4B5568] hover:text-[#263248] text-xs font-sans transition-colors"
              >
                Cancel and Discard Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Public Listing Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-[#263248]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F0] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#B79A5A]/40 animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#B79A5A]/20 mb-4">
              <span className="text-xs font-sans tracking-widest uppercase text-[#B79A5A] font-semibold">
                Public Website Card Preview
              </span>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-xs font-sans text-[#4B5568] hover:text-[#263248]"
              >
                Close Preview
              </button>
            </div>

            {/* Simulated Card in Public Website Theme */}
            <div className="bg-white rounded-xl overflow-hidden border border-[#B79A5A]/30 shadow-md">
              <div className="relative aspect-square w-full bg-[#FAF7F0]">
                {mainImage?.url ? (
                  <Image
                    src={mainImage.url}
                    alt={title || 'Artwork'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-[#4B5568]">
                    No image uploaded yet
                  </div>
                )}
                {isFeatured && (
                  <span className="absolute top-3 left-3 bg-[#B79A5A] text-white text-[10px] uppercase font-sans tracking-wider px-2.5 py-1 rounded-sm shadow-xs font-semibold">
                    Featured
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-[#263248]/90 text-white text-[10px] font-sans px-2.5 py-1 rounded-full">
                  {availability}
                </span>
              </div>

              <div className="p-5">
                <span className="text-[11px] font-sans text-[#B79A5A] uppercase tracking-widest font-medium">
                  {category}
                </span>
                <h4 className="text-lg font-serif font-bold text-[#263248] mt-1">
                  {title || 'Untitled Creation'}
                </h4>
                <p className="text-xs font-sans text-[#4B5568] line-clamp-2 mt-1 leading-relaxed">
                  {description || 'No description provided.'}
                </p>

                <div className="mt-4 pt-3 border-t border-[#FAF7F0] flex items-center justify-between">
                  <div className="text-base font-serif font-bold text-[#263248]">
                    ₹{Number(priceINR).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-sans text-[#4B5568]">
                    {dimensions || 'Dimensions on request'}
                  </span>
                </div>

                <div className="mt-4">
                  {availability === 'In Stock' ? (
                    <button
                      type="button"
                      className="w-full py-2 bg-[#B79A5A] text-white font-sans text-xs tracking-wider uppercase font-semibold rounded-[2px]"
                    >
                      Enquire / Acquire Piece
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full py-2 bg-[#263248] text-white font-sans text-xs tracking-wider uppercase font-medium rounded-[2px]"
                    >
                      Commission Bespoke Piece
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
