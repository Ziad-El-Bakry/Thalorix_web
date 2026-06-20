// src/lib/api/services/categories.service.ts
import axiosInstance from '../axios';
import { ENDPOINTS } from '../endpoints';
import { Category } from '../../../types';

export const categoriesService = {
  // جلب كل الـ Categories
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORIES.GET_ALL);
    return response.data.data || response.data.categories || response.data;
  },

  // جلب Category معينة بالـ ID
  getById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORIES.GET_BY_ID(id));
    return response.data;
  },

  // إنشاء Category جديدة
  create: async (data: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.post(ENDPOINTS.CATEGORIES.CREATE, data);
    return response.data;
  },

  // تعديل Category
  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.patch(ENDPOINTS.CATEGORIES.UPDATE(id), data);
    return response.data;
  },

  // حذف Category
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.CATEGORIES.DELETE(id));
  },
};