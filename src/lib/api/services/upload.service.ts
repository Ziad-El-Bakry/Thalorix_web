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
    // Some components pass a Blob (like audio), we need to ensure it's appended as 'file'
    formData.append('file', file);

    const { data } = await api.post<UploadResponse>(
      ENDPOINTS.CLOUDINARY.UPLOAD(slug),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return data;
  },

  /**
   * Delete a file from Cloudinary via the backend
   * @param publicId The Cloudinary public ID of the file
   */
  async deleteFile(publicId: string): Promise<void> {
    await api.delete(ENDPOINTS.CLOUDINARY.DELETE(publicId));
  },
};
