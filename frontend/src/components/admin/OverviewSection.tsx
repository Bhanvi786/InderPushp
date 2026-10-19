"use client";
import React from 'react';
import {
  Palette,
  CheckCircle2,
  FileEdit,
  ShoppingBag,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  FolderOpen,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { ArtworkStats } from '../../types/artwork';
import { DashboardSection } from './AdminSidebar';

interface OverviewSectionProps {
  stats: ArtworkStats | null;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onNavigate: (section: DashboardSection) => void;
  imageKitConfigured?: boolean;
  cloudinaryConfigured?: boolean;
}

export default function OverviewSection({
  stats,
  loading,
  error,
  onRetry,
  onNavigate,
}: OverviewSectionProps) {
  if (loading || (!stats && !error)) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-28 bg-[#F4EFE4] rounded-2xl border border-[#B79A5A]/20" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-[#F4EFE4] rounded-xl border border-[#B79A5A]/20" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-sm sm:text-base text-amber-950">
                Unable to load live dashboard statistics
              </h4>
              <p className="text-xs font-sans text-amber-800/80 mt-0.5">
                {error}
              </p>
            </div>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#263248] hover:bg-[#384055] text-white text-xs font-sans font-medium transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Artworks',
      value: stats?.totalArtworks ?? 0,
      icon: Palette,
      badge: 'Portfolio Total',
      color: 'border-l-4 border-[#263248]',
      accentBg: 'bg-[#263248]/5 text-[#263248]',
    },
    {
      label: 'Published Artworks',
      value: stats?.publishedArtworks ?? 0,
      icon: CheckCircle2,
      badge: 'Live on Gallery',
      color: 'border-l-4 border-emerald-600',
      accentBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Draft Artworks',
      value: stats?.draftArtworks ?? 0,
      icon: FileEdit,
      badge: 'In Progress',
      color: 'border-l-4 border-amber-500',
      accentBg: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Available Artworks',
      value: stats?.availableArtworks ?? 0,
      icon: ShoppingBag,
      badge: 'Ready / To Order',
      color: 'border-l-4 border-[#B79A5A]',
      accentBg: 'bg-[#B79A5A]/10 text-[#B79A5A]',
    },
    {
      label: 'Sold Artworks',
      value: stats?.soldArtworks ?? 0,
      icon: Clock,
      badge: 'Collectors Acquired',
      color: 'border-l-4 border-indigo-600',
      accentBg: 'bg-indigo-50 text-indigo-700',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Studio Banner */}
      <div className="rounded-2xl bg-[#263248] text-[#FAF7F0] p-6 sm:p-7 shadow-md border border-[#B79A5A]/30">
        <div className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-serif tracking-tight text-white font-semibold">
            Welcome to InderPushp Studio
          </h2>
          <p className="text-[#FAF7F0]/85 text-sm font-sans mt-2 leading-relaxed">
            Manage your artworks, update your gallery, and arrange the order in which your artwork appears on the website.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigate('add-artwork')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#B79A5A] hover:bg-[#C5A96A] text-[#263248] font-sans text-xs tracking-wider uppercase font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Sparkles size={14} />
              Add New Artwork
            </button>
            <button
              onClick={() => onNavigate('manage-gallery')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FAF7F0]/10 hover:bg-[#FAF7F0]/20 text-white font-sans text-xs tracking-wider uppercase font-medium transition-all border border-[#FAF7F0]/20 active:scale-95 cursor-pointer"
            >
              <FolderOpen size={14} />
              Curate Gallery Order
            </button>
          </div>
        </div>
      </div>

      {/* Real Statistics from Database */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-serif text-[#263248] font-semibold flex items-center gap-2">
            <TrendingUp size={18} className="text-[#B79A5A]" />
            Studio Statistics
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl p-5 shadow-xs border border-[#B79A5A]/20 transition-all hover:shadow-md hover:-translate-y-0.5 ${card.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-[#4B5568] font-medium tracking-wide">
                    {card.label}
                  </span>
                  <div className={`p-2 rounded-lg ${card.accentBg}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-3xl font-serif font-bold text-[#263248]">
                    {card.value}
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-sans text-[#4B5568]/80">
                  {card.badge}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category distribution breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#B79A5A]/20">
        <h4 className="text-sm font-serif font-semibold text-[#263248] mb-4 flex items-center justify-between">
          <span>Portfolio Category Distribution</span>
          <span className="text-xs font-sans font-normal text-[#4B5568]">
            {stats?.categories?.length || 0} active collections
          </span>
        </h4>

        {stats?.categories && stats.categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {stats.categories.map((c, i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-[#FAF7F0] border border-[#B79A5A]/20 flex flex-col justify-between"
              >
                <span className="text-xs font-sans font-medium text-[#263248]">
                  {c.category}
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xl font-serif font-bold text-[#B79A5A]">
                    {c.count}
                  </span>
                  <span className="text-[10px] text-[#4B5568] uppercase font-sans">
                    pieces
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#FAF7F0] rounded-lg border border-dashed border-[#B79A5A]/30">
            <ImageIcon size={32} className="mx-auto text-[#B79A5A]/60 mb-2" />
            <p className="text-sm font-sans text-[#263248] font-medium">No artwork cataloged yet</p>
            <p className="text-xs font-sans text-[#4B5568] mt-1">
              Add your first mosaic creation to populate collection insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
