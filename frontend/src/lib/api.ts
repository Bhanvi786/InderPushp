import { Artwork, ArtworkStats, AdminUser, Category } from '../types/artwork';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('inderpushp_admin_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('inderpushp_admin_token', token);
  }
};

export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('inderpushp_admin_token');
    sessionStorage.removeItem('inderpushp_admin_user');
    localStorage.removeItem('inderpushp_admin_token');
    localStorage.removeItem('inderpushp_admin_user');
    localStorage.removeItem('artograph_admin_token');
    localStorage.removeItem('artograph_admin_user');
  }
};

export const getStoredUser = (): AdminUser | null => {
  if (typeof window === 'undefined') return null;
  const userStr = sessionStorage.getItem('inderpushp_admin_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: AdminUser): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('inderpushp_admin_user', JSON.stringify(user));
  }
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Authentication API (Password-Only)
 */
export const authApi = {
  login: async (password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Incorrect password. Access denied.');
    return data;
  },

  getCurrentUser: async (): Promise<AdminUser> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Session expired. Please log in again.');
    return data.user as AdminUser;
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // Ignore network error on logout
    } finally {
      clearAuthToken();
    }
  },
};

/**
 * Artworks API
 */
export const artworksApi = {
  getStats: async (): Promise<ArtworkStats> => {
    const res = await fetch(`${API_BASE}/artworks/stats`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load statistics');
    return data.data;
  },

  getPublic: async (params?: { category?: string; featured?: boolean }): Promise<Artwork[]> => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All' && params.category !== 'All Works') {
      query.append('category', params.category);
    }
    if (params?.featured) query.append('featured', 'true');

    const res = await fetch(`${API_BASE}/artworks/public?${query.toString()}`, {
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch public artworks');
    return data.data || [];
  },

  getAll: async (params?: {
    search?: string;
    category?: string;
    availability?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<Artwork[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.availability && params.availability !== 'All') query.append('availability', params.availability);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const res = await fetch(`${API_BASE}/artworks?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch artworks');
    return data.data;
  },

  getById: async (id: string): Promise<Artwork> => {
    const res = await fetch(`${API_BASE}/artworks/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Artwork not found');
    return data.data;
  },

  create: async (artworkData: Partial<Artwork>): Promise<Artwork> => {
    const res = await fetch(`${API_BASE}/artworks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(artworkData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create artwork');
    return data.data;
  },

  update: async (id: string, artworkData: Partial<Artwork>): Promise<Artwork> => {
    const res = await fetch(`${API_BASE}/artworks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(artworkData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update artwork');
    return data.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/artworks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete artwork');
    return data;
  },

  togglePublish: async (id: string): Promise<Artwork> => {
    const res = await fetch(`${API_BASE}/artworks/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to change publish status');
    return data.data;
  },

  toggleFeatured: async (id: string): Promise<Artwork> => {
    const res = await fetch(`${API_BASE}/artworks/${id}/featured`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle featured status');
    return data.data;
  },

  reorder: async (orderList: { id: string; displayOrder: number }[]): Promise<void> => {
    const res = await fetch(`${API_BASE}/artworks/reorder`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderList }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reorder artworks');
  },
};

export const DEFAULT_CATEGORIES: Category[] = [
  { _id: 'cat-1', name: 'Floral & Nature', slug: 'floral-nature', description: 'Includes flowers, plants, birds, animals and landscapes.', displayOrder: 1, isActive: true },
  { _id: 'cat-2', name: 'Figurative & Spiritual', slug: 'figurative-spiritual', description: 'Includes human portraits, Lord Krishna, other deities and spiritual artwork.', displayOrder: 2, isActive: true },
  { _id: 'cat-3', name: 'Abstract & Geometric', slug: 'abstract-geometric', description: 'Includes abstract designs, geometric patterns and experimental mosaic art.', displayOrder: 3, isActive: true },
  { _id: 'cat-4', name: 'Decorative Art', slug: 'decorative-art', description: 'Includes mirrors, decorative objects, framed pieces and functional art.', displayOrder: 4, isActive: true },
  { _id: 'cat-5', name: 'Art for Spaces', slug: 'art-for-spaces', description: 'Includes wall installations, murals and custom artwork for homes, offices and other spaces.', displayOrder: 5, isActive: true },
  { _id: 'cat-6', name: 'Other', slug: 'other', description: 'For artwork that does not fit any of the above categories.', displayOrder: 6, isActive: true },
];

/**
 * Categories API
 */
export const categoriesApi = {
  getPublic: async (): Promise<Category[]> => {
    try {
      const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
      return data.data && data.data.length > 0 ? data.data : DEFAULT_CATEGORIES;
    } catch (err) {
      console.warn('Using fallback categories:', err);
      return DEFAULT_CATEGORIES;
    }
  },

  getAllAdmin: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE}/categories/admin`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch admin categories');
    return data.data || [];
  },

  create: async (categoryData: { name: string; description?: string; displayOrder?: number }): Promise<Category> => {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create category');
    return data.data;
  },

  update: async (
    id: string,
    categoryData: { name?: string; description?: string; displayOrder?: number; isActive?: boolean }
  ): Promise<Category> => {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update category');
    return data.data;
  },

  reorder: async (orderList: { id: string; displayOrder: number }[]): Promise<void> => {
    const res = await fetch(`${API_BASE}/categories/reorder`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderList }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reorder categories');
  },

  delete: async (id: string, reassignTo?: string): Promise<{ success: boolean; message: string }> => {
    const query = reassignTo ? `?reassignTo=${encodeURIComponent(reassignTo)}` : '';
    const res = await fetch(`${API_BASE}/categories/${id}${query}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      const err: any = new Error(data.message || 'Failed to delete category');
      err.requireReassignment = data.requireReassignment;
      err.count = data.count;
      throw err;
    }
    return data;
  },
};

/**
 * Upload & ImageKit API
 */
export const uploadApi = {
  checkStatus: async (): Promise<{
    configured: boolean;
    provider?: string;
    message: string;
  }> => {
    try {
      const res = await fetch(`${API_BASE}/upload/status`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return {
        configured: Boolean(data.configured),
        provider: data.provider || 'none',
        message: data.message,
      };
    } catch {
      return { configured: false, provider: 'none', message: 'Backend upload service not reachable.' };
    }
  },

  uploadImage: async (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ url: string; publicId: string }> => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('image', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/upload/single`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.message || 'Image upload failed.'));
          }
        } catch {
          reject(new Error('Failed to parse upload response.'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during image upload. Check backend status.'));
      };

      xhr.send(formData);
    });
  },

  deleteImage: async (publicId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/upload/delete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ publicId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete asset');
  },
};

/**
 * About Page & Artist Video Settings API
 */
export interface AboutSettingsData {
  videoUrl: string;
  posterUrl: string;
  heading?: string;
  subheading?: string;
  updatedAt?: string;
}

export const aboutSettingsApi = {
  get: async (): Promise<AboutSettingsData> => {
    const res = await fetch(`${API_BASE}/about-settings`, {
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch about settings');
    return data.data;
  },

  update: async (settings: Partial<AboutSettingsData>): Promise<AboutSettingsData> => {
    const res = await fetch(`${API_BASE}/about-settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update about settings');
    return data.data;
  },
};

export interface ContactEnquiryPayload {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  botTrap?: string;
}

export const contactApi = {
  sendEnquiry: async (payload: ContactEnquiryPayload): Promise<{ success: boolean; message: string; enquiryId?: string }> => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit enquiry. Please try again.');
    }
    return data;
  },
};


