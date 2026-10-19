"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Menu, Sparkles, RefreshCw, LogOut } from 'lucide-react';
import AdminSidebar, { DashboardSection } from './AdminSidebar';
import OverviewSection from './OverviewSection';
import ManageArtworksSection from './ManageArtworksSection';
import ArtworkFormSection from './ArtworkFormSection';
import ManageGallerySection from './ManageGallerySection';
import ManageCategoriesSection from './ManageCategoriesSection';
import AdminLogin from './AdminLogin';
import {
  authApi,
  artworksApi,
  categoriesApi,
  uploadApi,
  getAuthToken,
  clearAuthToken,
  setStoredUser,
} from '../../lib/api';
import { Artwork, ArtworkStats, AdminUser, Category } from '../../types/artwork';

export default function AdminDashboardRoot() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Active section
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState<ArtworkStats | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [imageKitConfigured, setImageKitConfigured] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Notification helper
  const showNotification = (message: string) => {
    setFeedbackNotice(message);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Ensure the admin dashboard asks for the password every time it is accessed
  useEffect(() => {
    clearAuthToken();
    setUser(null);
    setAuthChecked(true);
  }, []);

  // Handlers
  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      clearAuthToken();
    }
    setUser(null);
    setActiveSection('overview');
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setDataError(null);
    try {
      const [statsData, artworksData, categoriesData, uploadStatus] = await Promise.all([
        artworksApi.getStats(),
        artworksApi.getAll(),
        categoriesApi.getAllAdmin().catch(() => []),
        uploadApi.checkStatus().catch(() => ({ configured: false })),
      ]);
      setStats(statsData);
      setArtworks(artworksData);
      setCategories(categoriesData);
      if (uploadStatus) {
        setImageKitConfigured(uploadStatus.configured);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      const errMsg = (err?.message || '').toLowerCase();
      if (
        errMsg.includes('401') ||
        errMsg.includes('unauthorized') ||
        errMsg.includes('session expired') ||
        errMsg.includes('authentication required')
      ) {
        handleLogout();
      } else {
        setDataError(err?.message || 'Unable to retrieve dashboard data from database.');
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setActiveSection('add-artwork');
  };

  const handleAddNewArtwork = () => {
    setEditingArtwork(null);
    setActiveSection('add-artwork');
  };

  const handleSaveArtwork = async (payload: Partial<Artwork>) => {
    if (editingArtwork?._id) {
      await artworksApi.update(editingArtwork._id, payload);
      showNotification(`Artwork "${payload.title}" updated successfully.`);
    } else {
      await artworksApi.create(payload);
      showNotification(`Artwork "${payload.title}" created successfully.`);
    }
    setEditingArtwork(null);
    setActiveSection('manage-artworks');
    await fetchData();
  };

  const handleDeleteArtwork = async (id: string) => {
    await artworksApi.delete(id);
    showNotification('Artwork removed from catalog.');
    await fetchData();
  };

  const handleTogglePublish = async (id: string) => {
    await artworksApi.togglePublish(id);
    await fetchData();
  };

  const handleToggleFeatured = async (id: string) => {
    await artworksApi.toggleFeatured(id);
    await fetchData();
  };

  const handleSaveGalleryOrder = async (
    orderList: { id: string; displayOrder: number }[]
  ) => {
    await artworksApi.reorder(orderList);
    await fetchData();
  };

  // Not authenticated yet
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <RefreshCw size={24} className="animate-spin text-[#B79A5A]" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={(loggedIn) => setUser(loggedIn)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          if (sec === 'add-artwork' && activeSection !== 'add-artwork') {
            setEditingArtwork(null);
          }
          setActiveSection(sec);
        }}
        userName={user.name || 'Geetu Jaidka'}
        onLogout={handleLogout}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FAF7F0]/90 backdrop-blur-md border-b border-[#B79A5A]/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white border border-[#B79A5A]/30 text-[#263248]"
            >
              <Menu size={20} />
            </button>
            <div>
              <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#B79A5A] font-semibold block">
                InderPushp Studio Admin
              </span>
              <h1 className="text-base sm:text-lg font-serif font-bold text-[#263248] capitalize">
                {activeSection.replace('-', ' ')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              title="End session and return to login screen"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-rose-50 border border-rose-200/80 text-rose-700 hover:text-rose-800 text-xs font-sans font-medium transition-colors cursor-pointer shadow-xs"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Floating Notification */}
        {feedbackNotice && (
          <div className="fixed top-20 right-6 z-50 bg-[#263248] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#B79A5A]/50 text-xs font-sans flex items-center gap-2 animate-fade-up">
            <Sparkles size={14} className="text-[#B79A5A]" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* Section Contents */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {activeSection === 'overview' && (
            <OverviewSection
              stats={stats}
              loading={loading}
              error={dataError}
              onRetry={fetchData}
              onNavigate={(sec) => setActiveSection(sec)}
              imageKitConfigured={imageKitConfigured}
            />
          )}

          {activeSection === 'manage-artworks' && (
            <ManageArtworksSection
              artworks={artworks}
              categories={categories}
              loading={loading}
              onEdit={handleEditArtwork}
              onDelete={handleDeleteArtwork}
              onTogglePublish={handleTogglePublish}
              onToggleFeatured={handleToggleFeatured}
              onAddNew={handleAddNewArtwork}
            />
          )}

          {activeSection === 'add-artwork' && (
            <ArtworkFormSection
              initialArtwork={editingArtwork}
              onSave={handleSaveArtwork}
              onCancel={() => {
                setEditingArtwork(null);
                setActiveSection('manage-artworks');
              }}
              imageKitConfigured={imageKitConfigured}
              availableCategories={categories}
            />
          )}

          {activeSection === 'manage-categories' && (
            <ManageCategoriesSection
              categories={categories}
              refreshCategories={fetchData}
              showNotification={showNotification}
            />
          )}

          {activeSection === 'manage-gallery' && (
            <ManageGallerySection
              artworks={artworks}
              onSaveOrder={handleSaveGalleryOrder}
              onToggleFeatured={handleToggleFeatured}
              refreshArtworks={fetchData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
