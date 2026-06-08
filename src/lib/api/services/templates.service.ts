// src/lib/api/services/templates.service.ts
import axiosInstance from '../axios';
import { ENDPOINTS } from '../endpoints';
import { Template, Category } from '../../../types'; // بنسحبهم جاهزين من هنا ومنكررش تعريفهم تحت

export interface CreateTemplatePayload {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  fileUrl: File;
  image?: File;
}

// ============================================
// TEMPLATES SERVICE
// ============================================
export const templatesService = {
  // إنشاء Template جديد (فورم داتا)
  createTemplate: async (payload: CreateTemplatePayload): Promise<any> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('price', payload.price.toString());
    formData.append('categoryId', payload.categoryId);
    formData.append('fileUrl', payload.fileUrl);
    if (payload.image) {
      formData.append('image', payload.image);
    }

    const response = await axiosInstance.post(ENDPOINTS.TEMPLATES.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

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

  // تحديث حالة القالب (active, suspended)
  updateStatus: async (id: string, status: 'active' | 'suspended'): Promise<any> => {
    const response = await axiosInstance.patch(`${ENDPOINTS.TEMPLATES.UPDATE(id)}/status`, { status });
    return response.data;
  },

  // حذف القالب
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(ENDPOINTS.TEMPLATES.DELETE(id));
  },
};
