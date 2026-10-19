"use client";
import React from 'react';
import {
  LayoutDashboard,
  Palette,
  PlusCircle,
  Grid3X3,
  FolderTree,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type DashboardSection =
  | 'overview'
  | 'manage-artworks'
  | 'add-artwork'
  | 'manage-categories'
  | 'manage-gallery';

interface SidebarProps {
  activeSection: DashboardSection;
  onSelectSection: (section: DashboardSection) => void;
  userName?: string;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  activeSection,
  onSelectSection,
  userName = 'Geetu Jaidka',
  onLogout,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const navItems = [
    {
      id: 'overview' as DashboardSection,
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Analytics & Studio Health',
    },
    {
      id: 'manage-artworks' as DashboardSection,
      label: 'Manage Artworks',
      icon: Palette,
      description: 'Portfolio Catalog & Edits',
    },
    {
      id: 'add-artwork' as DashboardSection,
      label: 'Add New Artwork',
      icon: PlusCircle,
      description: 'Publish or Draft Creations',
    },
    {
      id: 'manage-categories' as DashboardSection,
      label: 'Manage Categories',
      icon: FolderTree,
      description: 'Living Gallery Categories',
    },
    {
      id: 'manage-gallery' as DashboardSection,
      label: 'Manage Gallery',
      icon: Grid3X3,
      description: 'Curate & Reorder Showcase',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#263248]/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#263248] text-[#FAF7F0] flex flex-col justify-between border-r border-[#B79A5A]/25 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Header */}
        <div>
          <div className="pt-8 pb-6 px-6 border-b border-[#FAF7F0]/10 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B79A5A] animate-pulse" />
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-medium">
                Artist Studio Admin
              </span>
            </div>
            <h1 className="text-xl font-serif tracking-tight text-[#FAF7F0] mt-1 font-semibold">
              Inder<span className="font-light italic text-[#D8C594]">Pushp</span>
            </h1>
            <p className="text-[11px] font-sans text-[#FAF7F0]/60">
              Mosaic Art Studio Management
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-left transition-all group ${
                    isActive
                      ? 'bg-[#B79A5A] text-white shadow-md shadow-[#B79A5A]/20'
                      : 'text-[#FAF7F0]/80 hover:bg-[#384055] hover:text-[#FAF7F0]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-1.5 rounded-md ${
                        isActive
                          ? 'bg-[#263248]/20 text-white'
                          : 'text-[#B79A5A] group-hover:text-[#D8C594]'
                      }`}
                    >
                      <Icon size={19} strokeWidth={isActive ? 2 : 1.75} />
                    </div>
                    <div>
                      <div className="text-sm font-sans font-medium tracking-wide">
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] font-sans ${
                          isActive ? 'text-white/80' : 'text-[#FAF7F0]/50'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`transition-transform duration-200 ${
                      isActive
                        ? 'translate-x-0.5 text-white'
                        : 'opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Actions */}
        <div className="p-4 border-t border-[#FAF7F0]/10 bg-[#1f293b]/50">
          {/* Public Gallery Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 mb-3 rounded-lg text-xs font-sans text-[#FAF7F0]/75 hover:text-white hover:bg-[#384055] transition-colors border border-[#B79A5A]/20 group"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#B79A5A]" />
              View Public Website
            </span>
            <ExternalLink
              size={13}
              className="text-[#FAF7F0]/50 group-hover:text-white"
            />
          </a>

          {/* User profile & Logout */}
          <div className="flex items-center justify-between pt-2 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#B79A5A] flex items-center justify-center text-white text-xs font-serif font-bold ring-2 ring-[#B79A5A]/30">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-[#FAF7F0] truncate font-sans">
                  {userName}
                </p>
                <p className="text-[10px] text-[#B79A5A] tracking-wider uppercase font-sans">
                  Artist & Master
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-2 text-[#FAF7F0]/60 hover:text-rose-300 hover:bg-rose-950/30 rounded-md transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
