"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  GripVertical,
  Save,
  Eye,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Artwork } from '../../types/artwork';

interface ManageGallerySectionProps {
  artworks: Artwork[];
  onSaveOrder: (reorderedArtworks: { id: string; displayOrder: number }[]) => Promise<void>;
  onToggleFeatured?: (id: string) => Promise<void>;
  refreshArtworks: () => Promise<void>;
}

export default function ManageGallerySection({
  artworks,
  onSaveOrder,
  onToggleFeatured,
  refreshArtworks,
}: ManageGallerySectionProps) {
  // Ordered items state
  const [items, setItems] = useState<Artwork[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Filter only published items or all items
  const [showDraftsToo, setShowDraftsToo] = useState(false);

  useEffect(() => {
    const list = [...artworks].sort((a, b) => a.displayOrder - b.displayOrder);
    setItems(list);
    setHasUnsavedChanges(false);
  }, [artworks]);

  const displayedItems = showDraftsToo
    ? items
    : items.filter((item) => item.isPublished);

  // Drag handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);

    // Update order numbers
    const reindexed = newItems.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    setDraggedIndex(index);
    setItems(reindexed);
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Move up/down with buttons for touch & accessibility
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reindexed = newItems.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    setItems(reindexed);
    setHasUnsavedChanges(true);
  };

  // Save changes to backend & MongoDB
  const handleSaveOrder = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const orderPayload = items.map((item, idx) => ({
        id: item._id,
        displayOrder: idx + 1,
      }));

      await onSaveOrder(orderPayload);
      setSaveSuccess(true);
      setHasUnsavedChanges(false);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-5xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#263248] font-semibold">
            Manage Gallery Curation & Ordering
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#4B5568]">
            Drag and reorder how patrons see your artwork on the public gallery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#B79A5A]/30 text-[#263248] font-sans text-xs font-semibold hover:bg-[#FAF7F0] transition-colors"
          >
            <Eye size={14} className="text-[#B79A5A]" />
            Preview Live Website
            <ExternalLink size={12} className="text-[#4B5568]" />
          </a>

          <button
            onClick={handleSaveOrder}
            disabled={isSaving || !hasUnsavedChanges}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold transition-all shadow-sm ${
              hasUnsavedChanges
                ? 'bg-[#B79A5A] hover:bg-[#D8C594] text-white shadow-md'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isSaving ? 'Persisting...' : 'Save Gallery Order'}
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-sans flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          <span>
            Gallery order successfully updated! Your public showcase reflects this sequence immediately.
          </span>
        </div>
      )}

      {/* Notice & filter bar */}
      <div className="p-4 bg-white rounded-xl shadow-xs border border-[#B79A5A]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
        <div className="flex items-center gap-2 text-[#4B5568]">
          <GripVertical size={16} className="text-[#B79A5A]" />
          <span>
            Grab any item card handle to drag up or down, or use the position adjustment arrows.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-[#263248] cursor-pointer">
            <input
              type="checkbox"
              checked={showDraftsToo}
              onChange={(e) => setShowDraftsToo(e.target.checked)}
              className="rounded text-[#B79A5A] focus:ring-[#B79A5A]"
            />
            Include unpublished drafts
          </label>
        </div>
      </div>

      {/* Drag & Drop Reorderable List */}
      <div className="space-y-3">
        {displayedItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#B79A5A]/20">
            <Sparkles size={32} className="mx-auto text-[#B79A5A]/60 mb-2" />
            <p className="text-sm font-serif font-semibold text-[#263248]">
              No artworks to curate
            </p>
            <p className="text-xs font-sans text-[#4B5568] mt-1">
              Add artworks to your portfolio first to arrange their gallery display order.
            </p>
          </div>
        ) : (
          displayedItems.map((item, index) => {
            const isDragging = draggedIndex === index;
            return (
              <div
                key={item._id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white border transition-all ${
                  isDragging
                    ? 'border-[#B79A5A] bg-[#FAF7F0] opacity-50 shadow-lg scale-[1.01]'
                    : 'border-[#B79A5A]/20 hover:border-[#B79A5A]/60 hover:shadow-sm'
                }`}
              >
                {/* Drag Handle & Order Number */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className="p-1.5 text-[#4B5568] hover:text-[#263248] cursor-grab active:cursor-grabbing rounded hover:bg-[#FAF7F0]"
                    title="Drag to reorder"
                  >
                    <GripVertical size={18} />
                  </div>

                  <span className="w-7 h-7 rounded-full bg-[#FAF7F0] border border-[#B79A5A]/30 flex items-center justify-center font-serif font-bold text-xs text-[#263248]">
                    {index + 1}
                  </span>

                  {/* Artwork Image */}
                  <div className="w-12 h-12 rounded-lg relative overflow-hidden bg-[#FAF7F0] border border-[#B79A5A]/25 shrink-0">
                    {item.mainImage?.url ? (
                      <Image
                        src={item.mainImage.url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-[#4B5568]">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-semibold text-[#263248] text-sm">
                        {item.title}
                      </span>
                      {item.isFeatured && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-sans uppercase tracking-wider bg-[#B79A5A]/15 text-[#B79A5A] font-semibold border border-[#B79A5A]/30">
                          Featured
                        </span>
                      )}
                      {!item.isPublished && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-sans uppercase tracking-wider bg-amber-100 text-amber-800">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-sans text-[#4B5568] flex items-center gap-2 mt-0.5">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span className="font-medium text-[#263248]">
                        ₹{item.priceINR.toLocaleString('en-IN')}
                      </span>
                      <span>·</span>
                      <span>{item.availability}</span>
                    </div>
                  </div>
                </div>

                {/* Right controls: Up/Down buttons */}
                <div className="flex items-center gap-2">
                  {/* Up button */}
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded-md bg-[#FAF7F0] text-[#263248] hover:bg-[#F4EFE4] disabled:opacity-30 text-xs font-bold transition-colors"
                    title="Move Up"
                  >
                    ▲
                  </button>

                  {/* Down button */}
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === displayedItems.length - 1}
                    className="p-1.5 rounded-md bg-[#FAF7F0] text-[#263248] hover:bg-[#F4EFE4] disabled:opacity-30 text-xs font-bold transition-colors"
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
