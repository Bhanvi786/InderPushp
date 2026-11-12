"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem } from '../types/cart';
import { Artwork } from '../types/artwork';

interface ToastNotification {
  id: string;
  artworkTitle: string;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (
    artwork: Artwork,
    quantity?: number,
    selectedVariant?: { name: string; priceINR: number; dimensions?: string; imageUrl?: string },
    selectedColor?: { name: string; imageUrl?: string; priceINR?: number }
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  lastAddedItem: CartItem | null;
  toastNotification: ToastNotification | null;
  dismissToast: () => void;
  cartBump: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'inderpushp_cart_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);
  const [cartBump, setCartBump] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to storage', e);
    }
  }, [items, isInitialized]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (
    artwork: Artwork,
    quantity = 1,
    selectedVariant?: { name: string; priceINR: number; dimensions?: string; imageUrl?: string },
    selectedColor?: { name: string; imageUrl?: string; priceINR?: number }
  ) => {
    if (!artwork || !artwork._id) return;

    // Use a unique item ID per variant & color combination
    const variantPart = selectedVariant?.name ? `_v_${selectedVariant.name.replace(/\s+/g, '_')}` : '';
    const colorPart = selectedColor?.name ? `_c_${selectedColor.name.replace(/\s+/g, '_')}` : '';
    const cartItemId = `${artwork._id}${variantPart}${colorPart}`;

    const basePrice = selectedColor?.priceINR && selectedColor.priceINR > 0
      ? selectedColor.priceINR
      : selectedVariant
      ? selectedVariant.priceINR
      : artwork.priceINR || 0;

    const itemPrice = basePrice;
    const itemDimensions = selectedVariant?.dimensions || artwork.dimensions;
    const itemImage = selectedColor?.imageUrl || selectedVariant?.imageUrl || artwork.mainImage?.url || '';

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        setLastAddedItem(updated[existingIndex]);
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          artworkId: artwork._id,
          variantName: selectedVariant?.name,
          colorName: selectedColor?.name,
          title: artwork.title,
          category: artwork.category,
          priceINR: itemPrice,
          imageUrl: itemImage,
          dimensions: itemDimensions,
          materials: artwork.materials,
          quantity: Math.max(1, quantity),
          availability: artwork.availability,
        };
        setLastAddedItem(newItem);
        return [...prevItems, newItem];
      }
    });

    // Detailed title for toast
    const labelParts = [];
    if (selectedVariant?.name) labelParts.push(selectedVariant.name);
    if (selectedColor?.name) labelParts.push(selectedColor.name);
    const toastTitle = labelParts.length > 0 ? `${artwork.title} (${labelParts.join(', ')})` : artwork.title;

    // Trigger toast notification
    setToastNotification({
      id: `${cartItemId}-${Date.now()}`,
      artworkTitle: toastTitle,
      imageUrl: itemImage,
    });

    // Trigger navbar cart badge bump animation
    setCartBump(true);
    setTimeout(() => {
      setCartBump(false);
    }, 600);

    // Auto clear toast notification after 3.2 seconds
    setTimeout(() => {
      setToastNotification((current) => (current?.id?.startsWith(artwork._id) ? null : current));
    }, 3200);

    // Auto clear last added item banner after 3 seconds
    setTimeout(() => {
      setLastAddedItem(null);
    }, 3200);
  };

  const dismissToast = () => {
    setToastNotification(null);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity } : it))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = useMemo(() => {
    return items.reduce((acc, it) => acc + it.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + (it.priceINR || 0) * it.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        lastAddedItem,
        toastNotification,
        dismissToast,
        cartBump,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
