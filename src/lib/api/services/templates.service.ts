import axiosInstance from '../axios';
import { ENDPOINTS } from '../endpoints';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Template {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  // ضيف أي حقول تانية الباك إند بيحتاجها أو بيرجعها (زي الـ categoryId مثلاً)
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
}

// ============================================
// SERVICES
// ============================================
export const templatesService = {
  // جلب كل الـ Templates
  getAll: async (): Promise<Template[]> => {
    const response = await axiosInstance.get(ENDPOINTS.TEMPLATES.GET_ALL);
    return response.data.templates || response.data;
  },

  // جلب Template معين بالـ ID
  getById: async (id: string): Promise<Template> => {
    const response = await axiosInstance.get(ENDPOINTS.TEMPLATES.GET_BY_ID(id));
    return response.data;
  },

  // إنشاء Template جديد
  create: async (data: Partial<Template>): Promise<Template> => {
    const response = await axiosInstance.post(ENDPOINTS.TEMPLATES.CREATE, data);
    return response.data;
  },

  // تعديل Template
  update: async (id: string, data: Partial<Template>): Promise<Template> => {
    const response = await axiosInstance.patch(ENDPOINTS.TEMPLATES.UPDATE(id), data);
    return response.data;
  },

  // حذف Template
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.TEMPLATES.DELETE(id));
  },
};

export const categoriesService = {
  
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORIES.GET_ALL);
    return response.data.categories || response.data;
  },

  
  getById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(ENDPOINTS.CATEGORIES.GET_BY_ID(id));
    return response.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.post(ENDPOINTS.CATEGORIES.CREATE, data);
    return response.data;
  },

  
  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.patch(ENDPOINTS.CATEGORIES.UPDATE(id), data);
    return response.data;
  },

 
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.CATEGORIES.DELETE(id));
  },
};