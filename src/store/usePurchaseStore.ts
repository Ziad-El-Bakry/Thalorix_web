import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Template } from "@/types";

interface PurchaseState {
  purchasedItems: Template[];
  addPurchases: (templates: Template[]) => void;
  hasPurchased: (templateId: string) => boolean;
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      purchasedItems: [],
      addPurchases: (templates) =>
        set((state) => {
          const newItems = templates.filter(
            (t) => !state.purchasedItems.find((item) => (item.id || item._id) === (t.id || t._id))
          );
          return { purchasedItems: [...state.purchasedItems, ...newItems] };
        }),
      hasPurchased: (templateId) => {
        const { purchasedItems } = get();
        return purchasedItems.some((item) => (item.id || item._id) === templateId);
      },
    }),
    {
      name: "marketplace-purchases",
    }
  )
);
