// lib/api/services/upload.service.ts
import { api } from '../axios';
import { ENDPOINTS } from '../endpoints';

export interface UploadResponse {
  url: string;
  public_id: string;
  bytes: number;
  format: string;
}

export const uploadService = {
  /**
   * Upload a file to Cloudinary via the backend
   * @param file The file to upload
   * @param slug The folder slug (e.g., 'posts', 'avatars', 'messages', 'templates')
   */
  async uploadFile(file: File | Blob, slug: string): Promise<UploadResponse> {
    const formData = new FormData();
    const filename = file instanceof File ? file.name : 'upload.bin';
    formData.append('file', file, filename);

    const token = localStorage.getItem('access_token');
    const response = await fetch(api.defaults.baseURL + ENDPOINTS.CLOUDINARY.UPLOAD(slug), {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${response.status}`);
    }

    return response.json();
  },

  /**
   * Delete a file from Cloudinary via the backend
   * @param publicId The Cloudinary public ID of the file
   */
  async deleteFile(publicId: string): Promise<void> {
    await api.delete(ENDPOINTS.CLOUDINARY.DELETE(publicId));
  },
};
