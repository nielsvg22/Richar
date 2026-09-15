"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/product-constants";

const STORAGE_KEY = "rc_cart";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // ignore corrupt/unavailable localStorage
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write failures (private browsing, quota)
    }
  }, [items, loaded]);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }

  function updateQuantity(slug: string, quantity: number) {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, quantity } : i))
    );
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function clear() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clear, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart moet binnen een CartProvider gebruikt worden.");
  return ctx;
}
