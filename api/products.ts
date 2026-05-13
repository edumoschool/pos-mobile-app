import api from './client';
import type { Product, CreateProductPayload, UpdateProductPayload, PaginatedResponse, PaginationQuery } from '@/types';

export const productsApi = {
  /** GET /products?search=&page=&limit= — list active products with inventory status */
  getAll: async (params?: PaginationQuery & { search?: string }): Promise<PaginatedResponse<Product>> => {
    const res = await api.get<PaginatedResponse<Product>>('/products', { params });
    return res.data;
  },

  /** GET /products/:id — includes category, brandCategory, unit, inventory, inventoryStatus */
  getById: async (id: string): Promise<Product> => {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  },

  /**
   * POST /products — create a product with optional image.
   * When an image is provided, the request uses multipart/form-data.
   * The backend auto-creates an inventory record with `quantity` and `minQuantity`.
   */
  create: async (data: CreateProductPayload, image?: {
    uri: string;
    name: string;
    type: string;
  }): Promise<Product> => {
    if (image) {
      const formData = new FormData();
      // Append all DTO fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      formData.append('image', {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any);

      const res = await api.post<Product>('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    }
    const res = await api.post<Product>('/products', data);
    return res.data;
  },

  /** PATCH /products/:id */
  update: async (id: string, data: UpdateProductPayload): Promise<Product> => {
    const res = await api.patch<Product>(`/products/${id}`, data);
    return res.data;
  },

  /** DELETE /products/:id — soft-deletes (sets isActive = false) */
  deactivate: async (id: string): Promise<Product> => {
    const res = await api.delete<Product>(`/products/${id}`);
    return res.data;
  },

  /**
   * POST /products/:id/image — upload/replace product image.
   * Accepts multipart/form-data with field name "file".
   * Max 50 MB; formats: jpeg, png, webp, gif.
   */
  uploadImage: async (id: string, image: {
    uri: string;
    name: string;
    type: string;
  }): Promise<Product> => {
    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      name: image.name,
      type: image.type,
    } as any);
    const res = await api.post<Product>(`/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  /** DELETE /products/:id/image — remove product image from storage */
  removeImage: async (id: string): Promise<Product> => {
    const res = await api.delete<Product>(`/products/${id}/image`);
    return res.data;
  },
};
