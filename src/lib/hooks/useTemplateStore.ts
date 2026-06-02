// src/store/useTemplateStore.ts
import { create } from 'zustand';
import { templatesService, categoriesService } from '../api/services';
import { Template, Category } from '../../types';

interface TemplateState {
  templates: Template[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTemplates: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  categories: [],
  loading: false,
  error: null,

  fetchTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const data = await templatesService.getAll();
      set({ templates: data, loading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'حدث خطأ أثناء جلب الـ Templates الحقيقية', 
        loading: false 
      });
    }
  },

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