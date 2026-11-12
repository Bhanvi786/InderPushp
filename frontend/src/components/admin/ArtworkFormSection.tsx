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
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  Artwork,
  ArtworkCategory,
  ArtworkVariant,
  ArtworkColorOption,
  AvailabilityStatus,
  ArtworkImage,
  Category,
} from '../../types/artwork';
import ArtworkImageUploader from './ArtworkImageUploader';
import { uploadApi } from '../../lib/api';

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
  const [variants, setVariants] = useState<ArtworkVariant[]>(
    initialArtwork?.variants || []
  );
  const [hasVariants, setHasVariants] = useState<boolean>(
    Boolean(initialArtwork?.variants && initialArtwork.variants.length > 0)
  );
  const [colorOptions, setColorOptions] = useState<ArtworkColorOption[]>(
    initialArtwork?.colorOptions || []
  );
  const [hasColors, setHasColors] = useState<boolean>(
    Boolean(initialArtwork?.colorOptions && initialArtwork.colorOptions.length > 0)
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
  const [colorUploadIndex, setColorUploadIndex] = useState<number | null>(null);

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

    // Filter valid variants if enabled
    const cleanedVariants = hasVariants
      ? variants
          .filter((v) => v.name.trim() && !isNaN(Number(v.priceINR)) && Number(v.priceINR) >= 0)
          .map((v) => ({
            name: v.name.trim(),
            priceINR: Number(v.priceINR),
            dimensions: v.dimensions?.trim() || '',
          }))
      : [];

    // Filter valid colors if enabled
    const cleanedColors = hasColors
      ? colorOptions
          .filter((c) => c.name.trim())
          .map((c) => {
            const validImages = Array.isArray(c.images) ? c.images.filter(Boolean) : [];
            const primaryImg = c.imageUrl?.trim() || validImages[0] || '';
            return {
              name: c.name.trim(),
              colorHex: c.colorHex?.trim() || '',
              imageUrl: primaryImg,
              images: validImages.length > 0 ? validImages : (primaryImg ? [primaryImg] : []),
              priceINR: Number(c.priceINR) || 0,
            };
          })
      : [];

    const stockNum = Number(stockQuantity);

    setIsSubmitting(true);
    try {
      const payload: Partial<Artwork> = {
        title: title.trim(),
        description: description.trim(),
        category,
        priceINR: priceNum,
        variants: cleanedVariants,
        colorOptions: cleanedColors,
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
                  Base Price in INR (₹) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-serif font-bold text-[#B79A5A]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="3000"
                    value={priceINR}
                    onChange={(e) => setPriceINR(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                  />
                </div>
                {hasVariants && (
                  <p className="text-[11px] font-sans text-[#4B5568] mt-1">
                    Used as the &ldquo;starting from&rdquo; price on artwork cards.
                  </p>
                )}
              </div>
            </div>

            {/* Set / Size Variants Option */}
            <div className="pt-2 pb-1 border-t border-b border-[#B79A5A]/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] block">
                    Different Sets / MRP Variants
                  </label>
                  <p className="text-[11px] font-sans text-[#4B5568]">
                    Enable if this artwork is sold in multiple sets (e.g. Single Piece, Pair, Set of 3) or sizes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !hasVariants;
                    setHasVariants(next);
                    if (next && variants.length === 0) {
                      setVariants([
                        { name: 'Single Piece', priceINR: Number(priceINR) || 3000, dimensions: dimensions || '' },
                        { name: 'Pair', priceINR: 5500, dimensions: dimensions || '' },
                        { name: 'Set of 3', priceINR: 7800, dimensions: dimensions || '' },
                      ]);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    hasVariants ? 'bg-[#B79A5A]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hasVariants ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {hasVariants && (
                <div className="space-y-3 bg-[#B79A5A]/5 p-3.5 rounded-lg border border-[#B79A5A]/20 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans font-semibold text-[#263248]">
                      Variants & MRP Pricing List
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setVariants((prev) => [
                          ...prev,
                          { name: '', priceINR: 0, dimensions: '' },
                        ])
                      }
                      className="inline-flex items-center gap-1 text-xs font-sans text-[#B79A5A] hover:text-[#9A7F43] font-semibold"
                    >
                      <Plus size={14} /> Add Set / Option
                    </button>
                  </div>

                  {variants.map((v, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Single Piece, Pair, Set of 3"
                        value={v.name}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].name = e.target.value;
                          setVariants(updated);
                        }}
                        className="flex-2 px-3 py-1.5 text-xs font-sans bg-white border border-[#B79A5A]/30 rounded-md text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                      />
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-serif font-bold text-[#B79A5A]">
                          ₹
                        </span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={v.priceINR || ''}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = [...variants];
                            updated[idx].priceINR = isNaN(val) ? 0 : val;
                            setVariants(updated);
                            // Auto sync first variant with base price if desired
                            if (idx === 0 && !isNaN(val) && val > 0) {
                              setPriceINR(String(val));
                            }
                          }}
                          className="w-full pl-6 pr-2 py-1.5 text-xs font-sans bg-white border border-[#B79A5A]/30 rounded-md text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Optional dimensions"
                        value={v.dimensions || ''}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].dimensions = e.target.value;
                          setVariants(updated);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-sans bg-white border border-[#B79A5A]/30 rounded-md text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                      />
                      <button
                        type="button"
                        onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                        title="Remove option"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {variants.length === 0 && (
                    <p className="text-xs text-stone-500 italic">
                      No variants added yet. Click &ldquo;Add Set / Option&rdquo; above.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Color / Shade Options */}
            <div className="pt-2 pb-1 border-b border-[#B79A5A]/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] block">
                    Multiple Color / Finish Options
                  </label>
                  <p className="text-[11px] font-sans text-[#4B5568]">
                    Upload and link dedicated photos for different colorways (e.g. Emerald Green, Amber Gold, Sapphire Blue).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !hasColors;
                    setHasColors(next);
                    if (next && colorOptions.length === 0) {
                      setColorOptions([
                        { name: 'Emerald Green', colorHex: '#1B4D3E', imageUrl: '', priceINR: 0 },
                        { name: 'Royal Amber', colorHex: '#C5832B', imageUrl: '', priceINR: 0 },
                      ]);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    hasColors ? 'bg-[#B79A5A]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hasColors ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {hasColors && (
                <div className="space-y-3 bg-[#B79A5A]/5 p-3.5 rounded-lg border border-[#B79A5A]/20 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans font-semibold text-[#263248]">
                      Colorways & Photo Links
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setColorOptions((prev) => [
                          ...prev,
                          { name: '', colorHex: '#263248', imageUrl: '', priceINR: 0 },
                        ])
                      }
                      className="inline-flex items-center gap-1 text-xs font-sans text-[#B79A5A] hover:text-[#9A7F43] font-semibold"
                    >
                      <Plus size={14} /> Add Color Option
                    </button>
                  </div>

                  {colorOptions.map((c, idx) => {
                    const colorImageList = Array.isArray(c.images) && c.images.length > 0
                      ? c.images
                      : c.imageUrl
                      ? [c.imageUrl]
                      : [];

                    return (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-[#B79A5A]/30 space-y-3 shadow-2xs">
                        {/* Top row: Color Picker, Name, Custom Price, and Delete */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-[#FAF7F0]">
                          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <input
                              type="color"
                              value={c.colorHex || '#263248'}
                              onChange={(e) => {
                                const updated = [...colorOptions];
                                updated[idx].colorHex = e.target.value;
                                setColorOptions(updated);
                              }}
                              className="w-8 h-8 p-0.5 rounded-md cursor-pointer border border-gray-300 shrink-0"
                              title="Choose swatch color"
                            />
                            <input
                              type="text"
                              placeholder="Color Name (e.g. Emerald Green)"
                              value={c.name}
                              onChange={(e) => {
                                const updated = [...colorOptions];
                                updated[idx].name = e.target.value;
                                setColorOptions(updated);
                              }}
                              className="flex-1 max-w-xs px-3 py-1.5 text-xs font-sans font-medium bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="relative w-32">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-serif font-bold text-[#B79A5A]">
                                ₹
                              </span>
                              <input
                                type="number"
                                placeholder="Same MRP"
                                value={c.priceINR || ''}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const updated = [...colorOptions];
                                  updated[idx].priceINR = isNaN(val) ? 0 : val;
                                  setColorOptions(updated);
                                }}
                                className="w-full pl-6 pr-2 py-1.5 text-xs font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                                title="Leave blank or 0 to inherit base price"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => setColorOptions((prev) => prev.filter((_, i) => i !== idx))}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Remove color option"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {/* Bottom area: Multi-image gallery for this specific color (up to 6 photos) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-sans font-semibold text-[#263248] flex items-center gap-1.5">
                              <span>Photos of {c.name || 'this color'}</span>
                              <span className="text-[10px] text-[#4B5568] font-normal">
                                ({colorImageList.length} added • upload 5-6 angles, framing, close-ups)
                              </span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            {/* Render all uploaded photos for this color */}
                            {colorImageList.map((imgUrl, imgIdx) => (
                              <div
                                key={imgIdx}
                                className="relative w-16 h-16 rounded-lg border border-[#B79A5A]/30 overflow-hidden bg-stone-100 group shrink-0"
                              >
                                <Image
                                  src={imgUrl}
                                  alt={`${c.name} ${imgIdx + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                                {imgIdx === 0 && (
                                  <span className="absolute bottom-0 inset-x-0 bg-[#263248]/85 text-white text-[8px] font-sans text-center py-0.5">
                                    Primary
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextImages = colorImageList.filter((_, i) => i !== imgIdx);
                                    const updated = [...colorOptions];
                                    updated[idx].images = nextImages;
                                    updated[idx].imageUrl = nextImages[0] || '';
                                    setColorOptions(updated);
                                  }}
                                  className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete photo"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            ))}

                            {/* Add More Photos button (allows multiple file selection) */}
                            <label className="w-16 h-16 rounded-lg border-2 border-dashed border-[#B79A5A]/40 hover:border-[#B79A5A] bg-[#FAF7F0] hover:bg-[#F4EFE4] flex flex-col items-center justify-center text-center cursor-pointer transition-colors shrink-0 group">
                              <Upload size={14} className="text-[#B79A5A] group-hover:scale-110 transition-transform mb-0.5" />
                              <span className="text-[9px] font-sans font-medium text-[#263248] leading-tight">
                                {colorUploadIndex === idx ? 'Saving...' : '+ Add Photos'}
                              </span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                multiple
                                className="hidden"
                                disabled={colorUploadIndex === idx}
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length === 0) return;
                                  setColorUploadIndex(idx);
                                  try {
                                    const newUrls: string[] = [];
                                    for (const file of files) {
                                      if (isStorageActive) {
                                        const res = await uploadApi.uploadImage(file);
                                        newUrls.push(res.url);
                                      } else {
                                        newUrls.push(URL.createObjectURL(file));
                                      }
                                    }
                                    const combined = [...colorImageList, ...newUrls];
                                    const updated = [...colorOptions];
                                    updated[idx].images = combined;
                                    updated[idx].imageUrl = combined[0] || '';
                                    setColorOptions(updated);
                                  } catch (err: any) {
                                    alert('Upload failed: ' + (err.message || 'Error'));
                                  } finally {
                                    setColorUploadIndex(null);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {colorOptions.length === 0 && (
                    <p className="text-xs text-stone-500 italic">
                      No color options added yet. Click &ldquo;Add Color Option&rdquo; above.
                    </p>
                  )}
                </div>
              )}
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
