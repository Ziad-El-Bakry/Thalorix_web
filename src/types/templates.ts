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
  // ضيف بقية الحقول اللي الباك إند بيرجعها هنا
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
}