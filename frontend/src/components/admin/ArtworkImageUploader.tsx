"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  Upload,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  FileImage,
  Sparkles,
} from 'lucide-react';
import { ArtworkImage } from '../../types/artwork';
import { uploadApi } from '../../lib/api';

interface ArtworkImageUploaderProps {
  mainImage: ArtworkImage | null;
  onMainImageChange: (image: ArtworkImage | null) => void;
  additionalImages: ArtworkImage[];
  onAdditionalImagesChange: (images: ArtworkImage[]) => void;
  imageKitConfigured?: boolean;
  cloudinaryConfigured?: boolean;
}

export default function ArtworkImageUploader({
  mainImage,
  onMainImageChange,
  additionalImages,
  onAdditionalImagesChange,
  imageKitConfigured,
  cloudinaryConfigured,
}: ArtworkImageUploaderProps) {
  const isStorageReady = Boolean(imageKitConfigured ?? cloudinaryConfigured);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);

  // Validate file
  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return 'File format not supported. Please upload JPG, PNG, WEBP, or AVIF.';
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'File exceeds maximum size of 10MB. Please select a compressed image.';
    }
    return null;
  };

  // Upload main image
  const handleMainFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (isStorageReady) {
        const result = await uploadApi.uploadImage(file, (percent) => {
          setUploadProgress(percent);
        });

        // Safe cleanup if old mainImage had a publicId
        if (mainImage?.publicId && mainImage.publicId !== result.publicId) {
          uploadApi.deleteImage(mainImage.publicId).catch(() => {});
        }

        onMainImageChange({
          url: result.url,
          publicId: result.publicId,
          alt: file.name.split('.')[0] || 'Mosaic Artwork',
          isMain: true,
        });
      } else {
        // Fallback when ImageKit credentials are pending
        // Create an in-browser object URL for seamless testing
        const objectUrl = URL.createObjectURL(file);
        setUploadProgress(100);
        onMainImageChange({
          url: objectUrl,
          publicId: '',
          alt: file.name.split('.')[0] || 'Mosaic Artwork',
          isMain: true,
        });
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed. Retry or use direct URL.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (mainFileInputRef.current) mainFileInputRef.current.value = '';
    }
  };

  // Upload additional images
  const handleAdditionalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newImages: ArtworkImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validationErr = validateFile(file);
        if (validationErr) {
          throw new Error(`${file.name}: ${validationErr}`);
        }

        if (isStorageReady) {
          const result = await uploadApi.uploadImage(file, (percent) => {
            setUploadProgress(Math.round(((i + percent / 100) / files.length) * 100));
          });
          newImages.push({
            url: result.url,
            publicId: result.publicId,
            alt: file.name.split('.')[0] || 'Artwork detail',
            isMain: false,
          });
        } else {
          newImages.push({
            url: URL.createObjectURL(file),
            publicId: '',
            alt: file.name.split('.')[0] || 'Artwork detail',
            isMain: false,
          });
        }
      }

      onAdditionalImagesChange([...additionalImages, ...newImages]);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload additional images.');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (additionalFileInputRef.current) additionalFileInputRef.current.value = '';
    }
  };

  // Remove main image
  const handleRemoveMainImage = async () => {
    if (mainImage?.publicId && isStorageReady) {
      uploadApi.deleteImage(mainImage.publicId).catch(() => {});
    }
    onMainImageChange(null);
  };

  // Remove additional image
  const handleRemoveAdditionalImage = async (index: number) => {
    const target = additionalImages[index];
    if (target?.publicId && isStorageReady) {
      uploadApi.deleteImage(target.publicId).catch(() => {});
    }
    const updated = additionalImages.filter((_, idx) => idx !== index);
    onAdditionalImagesChange(updated);
  };

  // Add image via direct URL
  const handleAddManualUrl = (asMain: boolean) => {
    if (!manualUrlInput.trim()) return;
    const item: ArtworkImage = {
      url: manualUrlInput.trim(),
      publicId: '',
      alt: 'Mosaic Artwork',
      isMain: asMain,
    };

    if (asMain) {
      onMainImageChange(item);
    } else {
      onAdditionalImagesChange([...additionalImages, item]);
    }

    setManualUrlInput('');
    setShowManualInput(false);
  };

  return (
    <div className="space-y-6">
      {/* Direct URL toggle button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] underline font-sans font-medium text-[#4B5568] hover:text-[#B79A5A] transition-colors"
        >
          {showManualInput ? 'Close URL Input' : 'Or Paste Direct Image URL'}
        </button>
      </div>

      {/* Manual URL Input dropdown if desired */}
      {showManualInput && (
        <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#B79A5A]/30 space-y-3">
          <label className="text-xs font-sans font-medium text-[#263248] block">
            Direct Image Link (e.g., https://... or /1.jpeg from local public)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/artwork.jpg"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs font-sans bg-white border border-[#B79A5A]/30 rounded-lg text-[#263248] focus:outline-hidden focus:border-[#B79A5A]"
            />
            <button
              type="button"
              onClick={() => handleAddManualUrl(true)}
              className="px-3 py-2 rounded-lg bg-[#263248] text-white text-xs font-sans font-medium hover:bg-[#384055]"
            >
              Set as Main
            </button>
            <button
              type="button"
              onClick={() => handleAddManualUrl(false)}
              className="px-3 py-2 rounded-lg bg-[#B79A5A] text-white text-xs font-sans font-medium hover:bg-[#D8C594]"
            >
              Add to Detail
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="p-4 rounded-xl bg-[#263248] text-white space-y-2">
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-[#B79A5A]" />
              Processing & uploading imagery to ImageKit...
            </span>
            <span>{uploadProgress !== null ? `${uploadProgress}%` : 'Working...'}</span>
          </div>
          <div className="w-full bg-[#384055] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#B79A5A] h-full transition-all duration-300"
              style={{ width: `${uploadProgress || 30}%` }}
            />
          </div>
        </div>
      )}

      {/* Error alert with retry */}
      {uploadError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-xs font-medium underline text-rose-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Image Section (Required) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#263248] flex items-center gap-1.5">
            Main Artwork Image <span className="text-rose-600">*</span>
          </label>
          <span className="text-[11px] font-sans text-[#4B5568]">
            Primary view on gallery & catalog
          </span>
        </div>

        <input
          ref={mainFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleMainFileUpload}
          className="hidden"
        />

        {mainImage?.url ? (
          <div className="relative rounded-xl overflow-hidden border-2 border-[#B79A5A] bg-white group aspect-4/3 max-h-[340px]">
            <Image
              src={mainImage.url}
              alt={mainImage.alt || 'Main artwork'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#263248]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
              <span className="text-xs text-white font-sans bg-[#263248]/80 px-2.5 py-1 rounded-md">
                Primary Showcase Visual
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => mainFileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white/90 text-[#263248] text-xs font-sans font-medium hover:bg-white flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw size={13} />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemoveMainImage}
                  className="p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-600 shadow-xs"
                  title="Remove Image"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => mainFileInputRef.current?.click()}
            className="border-2 border-dashed border-[#B79A5A]/40 hover:border-[#B79A5A] rounded-xl p-8 bg-[#FAF7F0] flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#F4EFE4] group"
          >
            <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-[#B79A5A]/30 flex items-center justify-center text-[#B79A5A] mb-3 group-hover:scale-105 transition-transform">
              <Upload size={20} />
            </div>
            <p className="text-sm font-sans font-semibold text-[#263248]">
              Upload Main Masterpiece Photo
            </p>
            <p className="text-xs font-sans text-[#4B5568] mt-1">
              Drag & drop or click to browse (JPG, PNG, WEBP, AVIF up to 10MB)
            </p>
            <span className="mt-4 px-3 py-1 rounded-md bg-[#263248] text-white text-[11px] font-sans font-medium">
              Select Primary Photo
            </span>
          </div>
        )}
      </div>

      {/* Additional Imagery Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#263248]">
            Additional Detail Views & Angles ({additionalImages.length}/5)
          </label>
          <span className="text-[11px] font-sans text-[#4B5568]">
            Close-up cuts, textures, framing
          </span>
        </div>

        <input
          ref={additionalFileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleAdditionalFileUpload}
          className="hidden"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {additionalImages.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-xl overflow-hidden bg-white border border-[#B79A5A]/30 group"
            >
              <Image
                src={img.url}
                alt={img.alt || `Detail angle ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <button
                type="button"
                onClick={() => handleRemoveAdditionalImage(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-[#263248]/80 text-white hover:bg-rose-600 transition-colors shadow-xs"
                title="Remove detail image"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {additionalImages.length < 5 && (
            <div
              onClick={() => additionalFileInputRef.current?.click()}
              className="aspect-square border border-dashed border-[#B79A5A]/40 hover:border-[#B79A5A] rounded-xl bg-[#FAF7F0] hover:bg-[#F4EFE4] flex flex-col items-center justify-center text-center cursor-pointer transition-colors group p-3"
            >
              <FileImage
                size={22}
                className="text-[#B79A5A] mb-1 group-hover:scale-110 transition-transform"
              />
              <span className="text-[11px] font-sans font-medium text-[#263248]">
                + Add Detail
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
