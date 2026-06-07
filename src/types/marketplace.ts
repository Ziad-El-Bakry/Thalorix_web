export interface Template {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  fileUrl?: string;
  image?: string;
  imageUrl?: string;
  categoryId?: any;
  sellerId?: any;
  status?: string;
  isActive?: boolean;
  fileSize?: string;
  format?: string;
  dimensions?: string;
  license?: string;
  
  // Optional frontend-specific mock fields
  rating?: number;
  reviewCount?: number;
  downloads?: number;
  author?: {
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
  features?: string[];
  tags?: string[];
  fileInfo?: {
    format: string;
    size: string;
    dimensions: string;
    license: string;
  };
}

export interface Review {
  id: string | number;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  time: string;
}

export type UploadState = "form" | "uploading" | "success";