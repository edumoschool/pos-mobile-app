import api from './client';
import type {
  Transaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  TransactionType,
} from '@/types';

export const transactionsApi = {
  /** GET /transactions?branchId=&type= — list transactions */
  getAll: async (params?: {
    branchId?: string;
    type?: TransactionType;
  }): Promise<Transaction[]> => {
    const res = await api.get<Transaction[]>('/transactions', { params });
    return res.data;
  },

  /** GET /transactions/:id — includes user, branch, expense/income category */
  getById: async (id: string): Promise<Transaction> => {
    const res = await api.get<Transaction>(`/transactions/${id}`);
    return res.data;
  },

  /** POST /transactions — owner/super_admin only */
  create: async (data: CreateTransactionPayload): Promise<Transaction> => {
    const res = await api.post<Transaction>('/transactions', data);
    return res.data;
  },

  /** PATCH /transactions/:id — owner/super_admin only */
  update: async (id: string, data: UpdateTransactionPayload): Promise<Transaction> => {
    const res = await api.patch<Transaction>(`/transactions/${id}`, data);
    return res.data;
  },

  /** DELETE /transactions/:id — owner/super_admin only */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};
