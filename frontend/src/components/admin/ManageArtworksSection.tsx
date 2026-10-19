"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { Artwork, ArtworkCategory, AvailabilityStatus, Category } from '../../types/artwork';

interface ManageArtworksSectionProps {
  artworks: Artwork[];
  categories?: Category[];
  loading: boolean;
  onEdit: (artwork: Artwork) => void;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish: (id: string) => Promise<void>;
  onToggleFeatured: (id: string) => Promise<void>;
  onAddNew: () => void;
}

export default function ManageArtworksSection({
  artworks,
  categories = [],
  loading,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
  onAddNew,
}: ManageArtworksSectionProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'order' | 'price' | 'title' | 'date'>('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Delete modal state
  const [deleteModalArtwork, setDeleteModalArtwork] = useState<Artwork | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract unique categories from dynamic categories + artworks plus 6 core defaults
  const dynamicCategories = React.useMemo(() => {
    const list = ['All'];
    if (categories && categories.length > 0) {
      categories.forEach((c) => {
        if (!list.includes(c.name)) list.push(c.name);
      });
    } else {
      list.push(
        'Floral & Nature',
        'Figurative & Spiritual',
        'Abstract & Geometric',
        'Decorative Art',
        'Art for Spaces',
        'Other'
      );
    }
    artworks.forEach((a) => {
      if (a.category && !list.includes(a.category)) {
        list.push(a.category);
      }
    });
    return list;
  }, [categories, artworks]);

  const availabilities: (AvailabilityStatus | 'All')[] = [
    'All',
    'In Stock',
    'Made to Order',
    'Sold',
    'Enquiry Only',
  ];

  // Filtering & Sorting
  const filteredArtworks = artworks
    .filter((item) => {
      const matchSearch =
        search === '' ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.materials?.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchAvailability =
        selectedAvailability === 'All' || item.availability === selectedAvailability;

      const matchStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Published' && item.isPublished) ||
        (selectedStatus === 'Draft' && !item.isPublished) ||
        (selectedStatus === 'Featured' && item.isFeatured);

      return matchSearch && matchCategory && matchAvailability && matchStatus;
    })
    .sort((a, b) => {
      let result = 0;
      if (sortBy === 'order') {
        result = a.displayOrder - b.displayOrder;
      } else if (sortBy === 'price') {
        result = a.priceINR - b.priceINR;
      } else if (sortBy === 'title') {
        result = a.title.localeCompare(b.title);
      } else if (sortBy === 'date') {
        result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === 'asc' ? result : -result;
    });

  const handleDeleteConfirm = async () => {
    if (!deleteModalArtwork) return;
    try {
      setIsDeleting(true);
      await onDelete(deleteModalArtwork._id);
      setDeleteModalArtwork(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getAvailabilityBadge = (status: AvailabilityStatus) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Made to Order':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Sold':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Enquiry Only':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#263248] font-semibold">
            Manage Artworks
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#4B5568]">
            Browse, filter, edit, or adjust availability across your portfolio ({filteredArtworks.length} of {artworks.length} displayed)
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#263248] hover:bg-[#384055] text-white font-sans text-xs tracking-wider uppercase font-semibold transition-all shadow-sm"
        >
          <Plus size={16} className="text-[#B79A5A]" />
          Add Artwork
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-[#B79A5A]/25 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4B5568]/60 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by title, category, materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/25 rounded-lg text-[#263248] placeholder-[#4B5568]/50 focus:outline-hidden focus:border-[#B79A5A] transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/25 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
            >
              {dynamicCategories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-sans bg-[#FAF7F0] border border-[#B79A5A]/25 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
            >
              {availabilities.map((a) => (
                <option key={a} value={a}>
                  Availability: {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary filters & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#FAF7F0]">
          {/* Status buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-sans">
            <span className="text-[#4B5568] mr-1 hidden sm:inline">Status:</span>
            {['All', 'Published', 'Draft'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedStatus === st
                    ? 'bg-[#B79A5A] text-white font-medium'
                    : 'bg-[#FAF7F0] text-[#263248] hover:bg-[#F4EFE4] border border-[#B79A5A]/20'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 text-xs font-sans">
            <span className="text-[#4B5568]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 bg-[#FAF7F0] border border-[#B79A5A]/25 rounded-md text-[#263248] text-xs focus:outline-hidden"
            >
              <option value="order">Gallery Order</option>
              <option value="price">Price (₹)</option>
              <option value="title">Title</option>
              <option value="date">Date Created</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 rounded-md bg-[#FAF7F0] border border-[#B79A5A]/25 text-[#263248] hover:bg-[#F4EFE4]"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Artworks Table / Cards Layout */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 border border-[#B79A5A]/20 text-center space-y-3 animate-pulse">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF7F0]" />
          <p className="text-sm font-sans text-[#4B5568]">Loading mosaic portfolio...</p>
        </div>
      ) : filteredArtworks.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-[#B79A5A]/25 text-center">
          <Package size={40} className="mx-auto text-[#B79A5A]/50 mb-3" />
          <h3 className="text-base font-serif text-[#263248] font-semibold">
            No artworks match your filters
          </h3>
          <p className="text-xs sm:text-sm font-sans text-[#4B5568] max-w-md mx-auto mt-1 mb-5">
            {search || selectedCategory !== 'All' || selectedAvailability !== 'All'
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Your studio has no artworks registered yet. Begin by adding your first creation.'}
          </p>
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#B79A5A] text-white font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#D8C594] transition-colors"
          >
            <Plus size={15} />
            Add First Artwork
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-xs border border-[#B79A5A]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F0] text-[11px] font-sans uppercase tracking-wider text-[#263248] border-b border-[#B79A5A]/20">
                  <th className="py-3.5 px-4 font-semibold">Artwork</th>
                  <th className="py-3.5 px-3 font-semibold">Category</th>
                  <th className="py-3.5 px-3 font-semibold">Price (INR)</th>
                  <th className="py-3.5 px-3 font-semibold">Availability</th>
                  <th className="py-3.5 px-3 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF7F0] text-xs font-sans">
                {filteredArtworks.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-[#FAF7F0]/60 transition-colors group"
                  >
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg relative overflow-hidden bg-[#FAF7F0] border border-[#B79A5A]/30 shrink-0">
                          {item.mainImage?.url ? (
                            <Image
                              src={item.mainImage.url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#4B5568]">
                              No Img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[#263248] text-sm group-hover:text-[#B79A5A] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#4B5568]">
                            {item.dimensions || 'Dimensions unset'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-[#263248]">
                      <span className="px-2 py-0.5 rounded-sm bg-[#FAF7F0] text-[#263248] border border-[#B79A5A]/20 text-[11px]">
                        {item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 font-serif font-bold text-[#263248]">
                      ₹{item.priceINR.toLocaleString('en-IN')}
                    </td>

                    {/* Availability */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getAvailabilityBadge(
                          item.availability
                        )}`}
                      >
                        {item.availability}
                      </span>
                    </td>

                    {/* Status: Published vs Draft */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onTogglePublish(item._id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                          item.isPublished
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300'
                        }`}
                        title="Click to toggle published / draft state"
                      >
                        {item.isPublished ? (
                          <>
                            <Eye size={11} />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff size={11} />
                            Draft
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-md text-[#263248] hover:text-[#B79A5A] hover:bg-[#FAF7F0] transition-colors"
                          title="Edit Artwork"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteModalArtwork(item)}
                          className="p-1.5 rounded-md text-[#4B5568] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Artwork"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalArtwork && (
        <div className="fixed inset-0 bg-[#263248]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#B79A5A]/30 animate-fade-up">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-2 rounded-full bg-rose-100">
                <AlertTriangle size={22} />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#263248]">
                Confirm Artwork Deletion
              </h3>
            </div>

            <p className="text-sm font-sans text-[#4B5568] leading-relaxed mb-4">
              Are you sure you want to permanently delete{' '}
              <strong className="text-[#263248]">"{deleteModalArtwork.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#FAF7F0]">
              <button
                onClick={() => setDeleteModalArtwork(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-xs font-sans text-[#263248] hover:bg-[#FAF7F0] transition-colors font-medium border border-[#B79A5A]/20"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-xs font-sans text-white bg-rose-600 hover:bg-rose-700 transition-colors font-semibold shadow-sm flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Artwork'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
