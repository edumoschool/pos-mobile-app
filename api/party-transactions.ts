import api from './client';
import type {
  ClientTransaction,
  CreateClientTransactionPayload,
  ClientBalanceDetail,
  SupplierTransaction,
  CreateSupplierTransactionPayload,
  SupplierBalanceDetail,
  ExcelExportResult,
} from '@/types';

// ─── Client Transactions (debt / payment tracking) ──────────────────────────

export const clientTransactionsApi = {
  /** POST /client-transactions — record income (payment) or outcome (debt) */
  create: async (data: CreateClientTransactionPayload): Promise<ClientTransaction> => {
    const res = await api.post<ClientTransaction>('/client-transactions', data);
    return res.data;
  },

  /** GET /client-transactions?clientId= */
  getAll: async (clientId?: string): Promise<ClientTransaction[]> => {
    const res = await api.get<ClientTransaction[]>('/client-transactions', {
      params: clientId ? { clientId } : undefined,
    });
    return res.data;
  },

  /** GET /client-transactions/:id */
  getById: async (id: string): Promise<ClientTransaction> => {
    const res = await api.get<ClientTransaction>(`/client-transactions/${id}`);
    return res.data;
  },

  /** GET /client-transactions/balance/:clientId — balance + all transactions */
  getBalance: async (clientId: string): Promise<ClientBalanceDetail> => {
    const res = await api.get<ClientBalanceDetail>(`/client-transactions/balance/${clientId}`);
    return res.data;
  },

  /** DELETE /client-transactions/:id */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/client-transactions/${id}`);
  },

  /** GET /client-transactions/export/excel?clientId= */
  exportExcel: async (clientId?: string): Promise<ExcelExportResult> => {
    const res = await api.get<ExcelExportResult>('/client-transactions/export/excel', {
      params: clientId ? { clientId } : undefined,
    });
    return res.data;
  },
};

// ─── Supplier Transactions ──────────────────────────────────────────────────

export const supplierTransactionsApi = {
  /** POST /supplier-transactions — record income (refund) or outcome (payment/debt) */
  create: async (data: CreateSupplierTransactionPayload): Promise<SupplierTransaction> => {
    const res = await api.post<SupplierTransaction>('/supplier-transactions', data);
    return res.data;
  },

  /** GET /supplier-transactions?supplierId= */
  getAll: async (supplierId?: string): Promise<SupplierTransaction[]> => {
    const res = await api.get<SupplierTransaction[]>('/supplier-transactions', {
      params: supplierId ? { supplierId } : undefined,
    });
    return res.data;
  },

  /** GET /supplier-transactions/:id */
  getById: async (id: string): Promise<SupplierTransaction> => {
    const res = await api.get<SupplierTransaction>(`/supplier-transactions/${id}`);
    return res.data;
  },

  /** GET /supplier-transactions/balance/:supplierId — balance + all transactions */
  getBalance: async (supplierId: string): Promise<SupplierBalanceDetail> => {
    const res = await api.get<SupplierBalanceDetail>(`/supplier-transactions/balance/${supplierId}`);
    return res.data;
  },

  /** DELETE /supplier-transactions/:id */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/supplier-transactions/${id}`);
  },

  /** GET /supplier-transactions/export/excel?supplierId= */
  exportExcel: async (supplierId?: string): Promise<ExcelExportResult> => {
    const res = await api.get<ExcelExportResult>('/supplier-transactions/export/excel', {
      params: supplierId ? { supplierId } : undefined,
    });
    return res.data;
  },
};
