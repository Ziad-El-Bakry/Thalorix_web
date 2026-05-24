// lib/api/services/templates.service.ts
import { api } from '../axios';
import { ENDPOINTS } from '../endpoints';

export interface CreateTemplatePayload {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  fileUrl: File; // The actual template file
  image?: File; // The thumbnail image
}

export const templatesService = {
  /**
   * Create a new template (Seller only)
   * This sends FormData since the backend handles Cloudinary upload for templates directly.
   */
  async createTemplate(payload: CreateTemplatePayload): Promise<any> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('price', payload.price.toString());
    formData.append('categoryId', payload.categoryId);
    formData.append('fileUrl', payload.fileUrl);
    if (payload.image) {
      formData.append('image', payload.image);
    }

    const { data } = await api.post(ENDPOINTS.TEMPLATES.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  /**
   * Get all templates
   */
  async getAllTemplates(): Promise<any[]> {
    const { data } = await api.get(ENDPOINTS.TEMPLATES.GET_ALL);
    return data;
  },
};
