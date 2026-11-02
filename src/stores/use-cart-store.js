import { removeItem } from "@base-ui/react/internals/itemEquality";
import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : 1,
          ),
        };
      }
      return { items: [...state.items, { ...product, qty: 1 }] };
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id != id) })),
  clear: () => set({ items: [] }),
}));
