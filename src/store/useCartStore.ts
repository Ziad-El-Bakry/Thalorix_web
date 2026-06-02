import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Template } from "@/types";

interface CartState {
  items: Template[];
  addToCart: (template: Template) => void;
  removeFromCart: (templateId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (template) =>
        set((state) => {
          const exists = state.items.find((item) => (item.id || item._id) === (template.id || template._id));
          if (exists) return state;
          return { items: [...state.items, template] };
        }),
      removeFromCart: (templateId) =>
        set((state) => ({
          items: state.items.filter((item) => (item.id || item._id) !== templateId),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price || 0), 0);
      },
    }),
    {
      name: "marketplace-cart",
    }
  )
);
