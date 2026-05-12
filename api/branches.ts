import api from './client';
import type { Branch, CreateBranchPayload, UpdateBranchPayload } from '@/types';

export const branchesApi = {
  /** GET /branches — list all branches (any role) */
  getAll: async (): Promise<Branch[]> => {
    const res = await api.get<Branch[]>('/branches');
    return res.data;
  },

  /** GET /branches/:id (any role) */
  getById: async (id: string): Promise<Branch> => {
    const res = await api.get<Branch>(`/branches/${id}`);
    return res.data;
  },

  /** POST /branches — owner/super_admin only */
  create: async (data: CreateBranchPayload): Promise<Branch> => {
    const res = await api.post<Branch>('/branches', data);
    return res.data;
  },

  /** PATCH /branches/:id — owner/super_admin only */
  update: async (id: string, data: UpdateBranchPayload): Promise<Branch> => {
    const res = await api.patch<Branch>(`/branches/${id}`, data);
    return res.data;
  },

  /** DELETE /branches/:id — deactivate (owner/super_admin only) */
  deactivate: async (id: string): Promise<Branch> => {
    const res = await api.delete<Branch>(`/branches/${id}`);
    return res.data;
  },
};
