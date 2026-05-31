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
  address?: string;
  ratings?: number;
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
};
