// src/store/useCategoryStore.ts
import { create } from 'zustand';
import { categoriesService } from '../lib/api/services';
import { Category } from '../types';


interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await categoriesService.getAll();
      set({ categories: data, loading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'حدث خطأ أثناء جلب الـ Categories الحقيقية', 
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));