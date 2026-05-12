import api from './client';
import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
  Supplier,
  CreateSupplierPayload,
  UpdateSupplierPayload,
  ClientListQuery,
  ExcelExportResult,
} from '@/types';

// ─── Clients ────────────────────────────────────────────────────────────────

export const clientsApi = {
  /** GET /clients?search=&sortBy=&order= */
  getAll: async (query?: ClientListQuery): Promise<Client[]> => {
    const res = await api.get<Client[]>('/clients', { params: query });
    return res.data;
  },

  /** GET /clients/:id */
  getById: async (id: string): Promise<Client> => {
    const res = await api.get<Client>(`/clients/${id}`);
    return res.data;
  },

  /** POST /clients */
  create: async (data: CreateClientPayload): Promise<Client> => {
    const res = await api.post<Client>('/clients', data);
    return res.data;
  },

  /** PATCH /clients/:id */
  update: async (id: string, data: UpdateClientPayload): Promise<Client> => {
    const res = await api.patch<Client>(`/clients/${id}`, data);
    return res.data;
  },

  /** DELETE /clients/:id */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },

  /** GET /clients/export/excel — returns download URL */
  exportExcel: async (): Promise<ExcelExportResult> => {
    const res = await api.get<ExcelExportResult>('/clients/export/excel');
    return res.data;
  },
};

// ─── Suppliers ──────────────────────────────────────────────────────────────

export const suppliersApi = {
  /** GET /suppliers?search= */
  getAll: async (search?: string): Promise<Supplier[]> => {
    const res = await api.get<Supplier[]>('/suppliers', { params: search ? { search } : undefined });
    return res.data;
  },

  /** GET /suppliers/:id */
  getById: async (id: string): Promise<Supplier> => {
    const res = await api.get<Supplier>(`/suppliers/${id}`);
    return res.data;
  },

  /** POST /suppliers */
  create: async (data: CreateSupplierPayload): Promise<Supplier> => {
    const res = await api.post<Supplier>('/suppliers', data);
    return res.data;
  },

  /** PATCH /suppliers/:id */
  update: async (id: string, data: UpdateSupplierPayload): Promise<Supplier> => {
    const res = await api.patch<Supplier>(`/suppliers/${id}`, data);
    return res.data;
  },

  /** DELETE /suppliers/:id */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },

  /** GET /suppliers/export/excel — returns download URL */
  exportExcel: async (): Promise<ExcelExportResult> => {
    const res = await api.get<ExcelExportResult>('/suppliers/export/excel');
    return res.data;
  },
};
