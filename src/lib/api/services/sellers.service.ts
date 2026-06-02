import { api } from '../axios';

export interface Seller {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  isActive: boolean;
  role: string;
  storeName?: string;
  storeDescription?: string;
  logo?: string;
  banner?: string;
  address?: string;
  businessCategory?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  businessType?: string;
  taxNumber?: string;
  verificationDocuments?: string[];
  ratings?: number;
  reviewsCount?: number;
  salesCount?: number;
  downloadsCount?: number;
  followersCount?: number;
  followingCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const sellersService = {
  /**
   * Get all sellers (Admin only)
   */
  async getAllSellers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    sellers: Seller[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { data } = await api.get('/seller', { params });
    const sellersList = data.sellers || data.data || [];
    const totalCount = data.meta?.total || data.total || sellersList.length;
    const pageNum = params?.page || 1;
    const limitNum = params?.limit || 10;
    
    return {
      sellers: sellersList.map((s: any) => ({
        ...s,
        id: s.id || s._id,
      })),
      total: totalCount,
      page: Number(pageNum),
      totalPages: Math.ceil(totalCount / limitNum),
    };
  },

  /**
   * Get seller by ID
   */
  async getSellerById(id: string): Promise<Seller> {
    const { data } = await api.get<Seller>(`/seller/${id}`);
    return data;
  },

  /**
   * Update seller details (e.g. activation, name, phone, etc.)
   */
  async updateSeller(id: string, dto: Partial<Seller>): Promise<{ message: string; seller: Seller }> {
    const { data } = await api.patch<{ message: string; seller: Seller }>(`/seller/${id}`, dto);
    return data;
  },

  /**
   * Delete seller (Soft delete on backend)
   */
  async deleteSeller(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/seller/${id}`);
    return data;
  },

  /**
   * Get templates owned by a specific seller
   */
  async getSellerTemplates(id: string): Promise<any[]> {
    const { data } = await api.get<any[]>(`/seller/${id}/templates`);
    return data;
  },

  /**
   * Get reviews left for a specific seller
   */
  async getSellerReviews(id: string): Promise<any[]> {
    const { data } = await api.get<any[]>(`/seller/${id}/reviews`);
    return data;
  },

  /**
   * Submit a customer review for a seller
   */
  async addSellerReview(id: string, review: { rating: number; comment: string }): Promise<any> {
    const { data } = await api.post<any>(`/seller/${id}/reviews`, review);
    return data;
  },

  /**
   * Upload logo directly to seller endpoint
   */
  async uploadLogo(file: File): Promise<{ message: string; seller: Seller }> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<{ message: string; seller: Seller }>(`/seller/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /**
   * Upload banner directly to seller endpoint
   */
  async uploadBanner(file: File): Promise<{ message: string; seller: Seller }> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<{ message: string; seller: Seller }>(`/seller/banner`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
