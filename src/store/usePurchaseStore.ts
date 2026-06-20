import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Template } from "@/types";
import { useAuthStore } from "./useAuthStore";

interface PurchaseState {
  // Map: userId -> purchasedTemplates
  userPurchasedItems: Record<string, Template[]>;
  addPurchases: (templates: Template[]) => void;
  hasPurchased: (templateId: string) => boolean;
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      userPurchasedItems: {},

      addPurchases: (templates) =>
        set((state) => {
          const currentUserId = useAuthStore.getState().currentUserId || "guest";
          const currentPurchases = state.userPurchasedItems[currentUserId] || [];
          
          const newItems = templates.filter(
            (t) => !currentPurchases.find((item) => (item.id || item._id) === (t.id || t._id))
          );
          
          const updatedUserPurchases = [...currentPurchases, ...newItems];

          return {
            userPurchasedItems: {
              ...state.userPurchasedItems,
              [currentUserId]: updatedUserPurchases,
            },
          };
        }),

      hasPurchased: (templateId) => {
        const currentUserId = useAuthStore.getState().currentUserId || "guest";
        const currentPurchases = get().userPurchasedItems[currentUserId] || [];
        return currentPurchases.some((item) => (item.id || item._id) === templateId);
      },
    }),
    {
      name: "marketplace-purchases-v2",
    }
  )
);
