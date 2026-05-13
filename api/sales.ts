import api from './client';
import type {
  Sale,
  CreateSalePayload,
  SaleSummary,
  SaleListQuery,
} from '@/types';

export const salesApi = {
  /**
   * POST /sales
   * Create a sale — anonymous (no clientId) or linked to a client.
   * Atomically decrements inventory and auto-creates a ClientTransaction
   * if paidAmount < total (debt sale).
   */
  create: async (data: CreateSalePayload): Promise<Sale> => {
    const res = await api.post<Sale>('/sales', data);
    return res.data;
  },

  /**
   * GET /sales?clientId=&branchId=&status=&from=&to=
   * List sales with optional filters.
   */
  getAll: async (params?: SaleListQuery): Promise<Sale[]> => {
    const res = await api.get<Sale[]>('/sales', { params });
    return res.data;
  },

  /**
   * GET /sales/summary?branchId=
   * Today's revenue, cost, gross profit, discount, and debt totals.
   */
  getSummary: async (branchId?: string): Promise<SaleSummary> => {
    const res = await api.get<SaleSummary>('/sales/summary', {
      params: branchId ? { branchId } : undefined,
    });
    return res.data;
  },

  /**
   * GET /sales/:id
   * Full sale detail — includes items, client, user, branch,
   * and all linked clientTransactions.
   */
  getById: async (id: string): Promise<Sale> => {
    const res = await api.get<Sale>(`/sales/${id}`);
    return res.data;
  },

  /**
   * PATCH /sales/:id/cancel
   * Cancel a sale — restores inventory stock and reverses client
   * debt via an offsetting ClientTransaction (if applicable).
   */
  cancel: async (id: string): Promise<Sale> => {
    const res = await api.patch<Sale>(`/sales/${id}/cancel`);
    return res.data;
  },
};
