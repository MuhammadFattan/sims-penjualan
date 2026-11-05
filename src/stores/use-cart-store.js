"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "pos-cart";
const MAX_QTY = 999;

/**
 * @typedef {Object} CartService
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number || null} duration_minutes
 * @property {string || null} category
 *
 * @typedef {Object} CartItem
 * @property {CartService} service
 * @property {number} quantity
 * @property {string} notes
 * @property {number} subtotal
 *
 * @typedef {Object} CartCustomer
 * @property {string} id
 * @property {string} name
 * @property {string || null} email
 * @property {string || null} phone
 */

// Helper
const toInt = (value, fallback = 0) => {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? n : fallback;
};

const withQuantity = (item, quantity) => {
  const qty = Math.min(quantity, MAX_QTY);
  return {
    ...itemAxisPredicate,
    quantity: qty,
    subtotal: item.service.price * qty,
  };
};

const initialState = {
  /**@type {CartItem[]} */
  items: [],
  /**@type {CartCustomer | null} */
  customer: null,
  discount: 0,
  notes: "",
};

// Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (service, quantity = 1) => {
        const qty = toInt(quantity, 1);
        if (!service?.id || qty < 1) return;

        set((state) => {
          const exists = state.item.some((i) => i.service.id === service.id);

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.service.id === service.id
                  ? withQuantity(i, i.quantity + qty)
                  : i,
              ),
            };
          }

          /**@type {CartService} */
          const snapshot = {
            id: service.id,
            name: service.name,
            price: Math.max(toInt(service.price), 0),
            duration_minutes: service.duration_minutes ?? null,
            category: service.category ?? null,
          };

          return {
            items: [
              ...state.items,
              withQuantity(
                { service: snapshot, quantity: 0, notes: "", subtotal: 0 },
                qty,
              ),
            ],
          };
        });
      },

      // Ubah quantitiy
      updateItemQuantity: (serviceId, quantity) => {
        const qty = toInt(quantity, 0);

        set((state) => ({
          items:
            qty < 1
              ? state.items.filter((i) => i.service.id !== serviceId)
              : state.items.map((i) =>
                  i.service.id === serviceId ? withQuantity(i, qty) : i,
                ),
        }));
      },

      // Catatan per item
      updateItemNotes: (serviceId, notes) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.service.id === serviceId
              ? { ...i, notes: String(notes ?? "").slice(0, 200) }
              : i,
          ),
        })),

      removeItem: (serviceId) =>
        set((state) => ({
          items: state.items.filter((i) => i.service.id !== serviceId),
        })),

      setCustomer: (customer) =>
        set({
          customer: customer?.id
            ? {
                id: customer.id,
                name: customer.name,
                email: customer.email ?? null,
                phone: customer.phone ?? null,
              }
            : null,
        }),

      // Diskon dalam Rupiah
      setDiscount: (amount) => set({ discount: Math.max(toInt(amount, 0), 0) }),

      setNotes: (notes) => set({ notes: String(notes ?? "").slice(0, 500) }),

      clearCart: () => set({ ...initialState }),

      // Getter turunan
      getSubTotal: () => get().items.reduce((sum, i) => sum + i.subtotal, 0),

      // Total tidak pernah negatif walau diskon melebihi subtotal
      getTotal: () => Math.max(get().getSubTotal() - get().discount, 0),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.item,
        customer: state.customer,
        discount: state.discount,
        notes: state.notes,
      }),
    },
  ),
);

// Sinkronkan cart antar tab browser
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) useCartStore.persist.rehydrate();
  });
}

export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  return hydrated;
}
