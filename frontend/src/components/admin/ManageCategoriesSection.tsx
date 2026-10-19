"use client";
import React, { useState } from 'react';
import {
  FolderPlus,
  Edit2,
  Trash2,
  GripVertical,
  Layers,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Category } from '../../types/artwork';
import { categoriesApi } from '../../lib/api';

interface ManageCategoriesSectionProps {
  categories: Category[];
  refreshCategories: () => Promise<void>;
  showNotification: (msg: string) => void;
}

export default function ManageCategoriesSection({
  categories,
  refreshCategories,
  showNotification,
}: ManageCategoriesSectionProps) {
  // New category form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit category modal
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Delete category with reassignment state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [reassignTarget, setReassignTarget] = useState<string>('Other');
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Order state
  const [orderedList, setOrderedList] = useState<Category[]>(categories);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  React.useEffect(() => {
    setOrderedList([...categories].sort((a, b) => a.displayOrder - b.displayOrder));
    setHasOrderChanged(false);
  }, [categories]);

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError('Category name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      await categoriesApi.create({
        name: newName.trim(),
        description: newDescription.trim(),
      });
      showNotification(`Category "${newName.trim()}" created successfully.`);
      setNewName('');
      setNewDescription('');
      setShowAddForm(false);
      await refreshCategories();
    } catch (err: any) {
      setFormError(err.message || 'Failed to create category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditDescription(cat.description || '');
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingCategory || !editName.trim()) return;

    setIsEditing(true);
    try {
      await categoriesApi.update(editingCategory._id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      showNotification(`Category "${editName.trim()}" updated successfully.`);
      setEditingCategory(null);
      await refreshCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to update category.');
    } finally {
      setIsEditing(false);
    }
  };

  // Open Delete Dialog
  const openDeleteModal = (cat: Category) => {
    setDeletingCategory(cat);
    setDeleteWarning(null);
    // Find a default target category other than the one being deleted
    const otherCat = categories.find((c) => c._id !== cat._id);
    setReassignTarget(otherCat?.name || 'Other');
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;

    setIsDeleting(true);
    setDeleteWarning(null);
    try {
      await categoriesApi.delete(deletingCategory._id, reassignTarget);
      showNotification(`Category "${deletingCategory.name}" removed successfully.`);
      setDeletingCategory(null);
      await refreshCategories();
    } catch (err: any) {
      if (err.requireReassignment) {
        setDeleteWarning(err.message);
      } else {
        alert(err.message || 'Failed to delete category.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Drag and drop ordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...orderedList];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setOrderedList(updated);
    setHasOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      const payload = orderedList.map((cat, idx) => ({
        id: cat._id,
        displayOrder: idx + 1,
      }));
      await categoriesApi.reorder(payload);
      showNotification('Category display order updated successfully.');
      setHasOrderChanged(false);
      await refreshCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to reorder categories.');
    } finally {
      setIsSavingOrder(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#B79A5A]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-[#263248] font-bold">
            Gallery Categories
          </h2>
          <p className="text-xs font-sans text-[#4B5568] mt-1 max-w-xl">
            Organize your art collections here. You can add new collections, edit their names, or change how they appear on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasOrderChanged && (
            <button
              onClick={handleSaveOrder}
              disabled={isSavingOrder}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#B79A5A] hover:bg-[#D8C594] text-[#263248] text-xs font-sans font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <Save size={14} />
              {isSavingOrder ? 'Saving...' : 'Save Order'}
            </button>
          )}

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#263248] hover:bg-[#384055] text-white text-xs font-sans font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <Plus size={15} />
            {showAddForm ? 'Cancel' : 'New Category'}
          </button>
        </div>
      </div>

      {/* Add New Category Form Accordion */}
      {showAddForm && (
        <form
          onSubmit={handleCreateCategory}
          className="bg-[#FAF7F0] rounded-2xl p-6 border-2 border-[#B79A5A]/40 shadow-md space-y-4 animate-fade-up"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#263248] uppercase tracking-wider flex items-center gap-2">
              <FolderPlus size={16} className="text-[#B79A5A]" />
              Create New Category
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-[#4B5568] hover:text-rose-600"
            >
              <X size={16} />
            </button>
          </div>

          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-center gap-2">
              <AlertCircle size={15} className="text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1">
                Category Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Heritage Murals, Sacred Geometries"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-sans bg-white border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1">
                Brief Curatorial Description
              </label>
              <input
                type="text"
                placeholder="e.g., Handcrafted glass compositions depicting..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-sans bg-white border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg bg-white border border-[#B79A5A]/30 text-[#4B5568] text-xs font-sans font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#263248] hover:bg-[#B79A5A] text-white text-xs font-sans font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      {/* Categories List Table with Drag-to-Reorder */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#B79A5A]/25 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#FAF7F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[#B79A5A]" />
            <h3 className="text-sm font-serif font-bold text-[#263248]">
              Active Categories ({orderedList.length})
            </h3>
          </div>
          <span className="text-[11px] font-sans text-[#4B5568]">
            Drag handle <GripVertical size={13} className="inline text-[#B79A5A]" /> to rearrange public filter order
          </span>
        </div>

        <div className="divide-y divide-[#FAF7F0]">
          {orderedList.map((cat, index) => (
            <div
              key={cat._id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
                draggedIndex === index
                  ? 'bg-[#F4EFE4]/80 opacity-60'
                  : 'hover:bg-[#FAF7F0]/60'
              }`}
            >
              {/* Left Drag Grip & Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="cursor-grab active:cursor-grabbing p-1.5 rounded-md hover:bg-white text-[#B79A5A]"
                  title="Drag to change order"
                >
                  <GripVertical size={16} />
                </div>

                <div className="w-7 h-7 rounded-full bg-[#FAF7F0] border border-[#B79A5A]/30 flex items-center justify-center text-[11px] font-serif font-semibold text-[#263248] shrink-0">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-sans font-semibold text-[#263248] truncate">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF7F0] text-[#4B5568] border border-[#B79A5A]/20">
                      /{cat.slug}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs font-sans text-[#4B5568] truncate max-w-md mt-0.5">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Artwork Count & Actions */}
              <div className="flex items-center gap-4 shrink-0">
                <span className="px-3 py-1 rounded-full text-xs font-sans font-medium bg-[#FAF7F0] border border-[#B79A5A]/30 text-[#263248]">
                  {cat.artworkCount ?? cat.totalArtworks ?? 0} artworks
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded-lg bg-[#FAF7F0] hover:bg-[#263248] text-[#263248] hover:text-white transition-colors"
                    title="Rename / Edit description"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => openDeleteModal(cat)}
                    className="p-2 rounded-lg bg-[#FAF7F0] hover:bg-rose-600 text-rose-600 hover:text-white transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* EDIT MODAL                                               */}
      {/* ======================================================== */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263248]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#B79A5A]/30 space-y-4 animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F0]">
              <h3 className="text-base font-serif font-bold text-[#263248]">
                Edit Category
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-[#4B5568] hover:text-rose-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                />
                <p className="text-[11px] font-sans text-[#4B5568] mt-1">
                  Note: Renaming automatically updates all artworks currently assigned to this category.
                </p>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1">
                  Curatorial Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-xs font-sans font-medium text-[#263248]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isEditing || !editName.trim()}
                className="px-5 py-2 rounded-lg bg-[#263248] hover:bg-[#B79A5A] text-white text-xs font-sans font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isEditing ? 'Saving...' : 'Update Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DELETE MODAL WITH REASSIGNMENT GUARANTEE                */}
      {/* ======================================================== */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#263248]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-rose-300 space-y-4 animate-fade-up">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-200">
                <Trash2 size={20} />
              </div>
              <h3 className="text-base font-serif font-bold text-[#263248]">
                Delete &quot;{deletingCategory.name}&quot;?
              </h3>
            </div>

            <p className="text-xs font-sans text-[#4B5568] leading-relaxed">
              Before deleting, any artworks currently categorized under <strong>{deletingCategory.name}</strong> will be safely reassigned to avoid orphaned records.
            </p>

            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] mb-1.5">
                Reassign associated artworks to:
              </label>
              <select
                value={reassignTarget}
                onChange={(e) => setReassignTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-sans bg-[#FAF7F0] border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
              >
                <option value="Other">Other</option>
                {categories
                  .filter((c) => c._id !== deletingCategory._id && c.name !== 'Other')
                  .map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            {deleteWarning && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-sans">
                {deleteWarning}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-xs font-sans font-medium text-[#263248]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-sans font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm & Reassign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
