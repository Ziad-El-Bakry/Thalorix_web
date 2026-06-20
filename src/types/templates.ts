// src/types/templates.ts

export interface Template {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  fileSize?: string;
  format?: string;
  dimensions?: string;
  license?: string;
  ratings?: number;
  reviewsCount?: number;
 
}

export interface TemplateReview {
  _id: string;
  id?: string;
  userId: {
    _id?: string;
    id?: string;
    name?: string;
    username?: string;
    avatarUrl?: string;
    avatar?: string;
    logo?: string;
  };
  templateId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
}