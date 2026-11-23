"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { IceLevel, MenuItem, OrderItem, SugarLevel } from "@/lib/types";

export interface CartItem extends OrderItem {
  key: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (item: MenuItem) => void;
  updateQuantity: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  updateIce: (key: string, ice: IceLevel) => void;
  updateSugar: (key: string, sugar: SugarLevel) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((menuItem: MenuItem) => {
    setItems((prev) => {
      const defaultIce: IceLevel = "100%";
      const defaultSugar: SugarLevel = "100%";
      const existing = prev.find(
        (entry) =>
          entry.menuItemId === menuItem.id &&
          entry.ice === defaultIce &&
          entry.sugar === defaultSugar
      );

      if (existing) {
        return prev.map((entry) =>
          entry.key === existing.key
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      const key = `${menuItem.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      return [
        ...prev,
        {
          key,
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          ice: defaultIce,
          sugar: defaultSugar,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((entry) =>
          entry.key === key
            ? { ...entry, quantity: entry.quantity + delta }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((entry) => entry.key !== key));
  }, []);

  const updateIce = useCallback((key: string, ice: IceLevel) => {
    setItems((prev) =>
      prev.map((entry) => (entry.key === key ? { ...entry, ice } : entry))
    );
  }, []);

  const updateSugar = useCallback((key: string, sugar: SugarLevel) => {
    setItems((prev) =>
      prev.map((entry) => (entry.key === key ? { ...entry, sugar } : entry))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return {
      items,
      totalItems,
      totalAmount,
      addItem,
      updateQuantity,
      removeItem,
      updateIce,
      updateSugar,
      clearCart,
    };
  }, [
    items,
    addItem,
    updateQuantity,
    removeItem,
    updateIce,
    updateSugar,
    clearCart,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
