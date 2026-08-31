import api from './client';
import type {
  Tenant,
  CreateTenantPayload,
  UpdateTenantPayload,
  UpdateOwnTenantPayload,
} from '@/types';

export const tenantsApi = {
  // ─── Owner self-service ─────────────────────────────────────────────

  /** GET /tenants/me — current user's own business profile (with plan, branches, counts) */
  getMine: async (): Promise<Tenant> => {
    const res = await api.get<Tenant>('/tenants/me');
    return res.data;
  },

  /** PATCH /tenants/me — update own business name / language (owner or super_admin) */
  updateMine: async (data: UpdateOwnTenantPayload): Promise<Tenant> => {
    const res = await api.patch<Tenant>('/tenants/me', data);
    return res.data;
  },

  // ─── super_admin only ───────────────────────────────────────────────

  /** GET /tenants — list every tenant */
  getAll: async (): Promise<Tenant[]> => {
    const res = await api.get<Tenant[]>('/tenants');
    return res.data;
  },

  /** GET /tenants/:id */
  getById: async (id: string): Promise<Tenant> => {
    const res = await api.get<Tenant>(`/tenants/${id}`);
    return res.data;
  },

  /** POST /tenants */
  create: async (data: CreateTenantPayload): Promise<Tenant> => {
    const res = await api.post<Tenant>('/tenants', data);
    return res.data;
  },

  /** PATCH /tenants/:id */
  update: async (id: string, data: UpdateTenantPayload): Promise<Tenant> => {
    const res = await api.patch<Tenant>(`/tenants/${id}`, data);
    return res.data;
  },

  /** DELETE /tenants/:id — deactivate */
  deactivate: async (id: string): Promise<Tenant> => {
    const res = await api.delete<Tenant>(`/tenants/${id}`);
    return res.data;
  },
};
