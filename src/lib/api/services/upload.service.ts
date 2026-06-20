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
  async uploadFile(
    file: File | Blob, 
    slug: string,
    onProgress?: (progressEvent: any) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    const filename = file instanceof File ? file.name : 'upload.bin';
    formData.append('file', file, filename);

    try {
      const response = await api.post<UploadResponse>(
        ENDPOINTS.CLOUDINARY.UPLOAD(slug), 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress) onProgress(progressEvent);
          },
          timeout: 0 // Disable timeout for large uploads
        }
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  /**
   * Delete a file from Cloudinary via the backend
   * @param publicId The Cloudinary public ID of the file
   */
  async deleteFile(publicId: string): Promise<void> {
    await api.delete(ENDPOINTS.CLOUDINARY.DELETE(publicId));
  },
};
