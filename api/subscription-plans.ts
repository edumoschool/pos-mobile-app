import api from './client';
import type {
  SubscriptionPlan,
  CreateSubscriptionPlanPayload,
  UpdateSubscriptionPlanPayload,
} from '@/types';

export const subscriptionPlansApi = {
  /** GET /subscription-plans — list active plans (any authenticated user) */
  getAll: async (): Promise<SubscriptionPlan[]> => {
    const res = await api.get<SubscriptionPlan[]>('/subscription-plans');
    return res.data;
  },

  /** GET /subscription-plans/:id */
  getById: async (id: string): Promise<SubscriptionPlan> => {
    const res = await api.get<SubscriptionPlan>(`/subscription-plans/${id}`);
    return res.data;
  },

  // ─── super_admin only ───────────────────────────────────────────────

  /** POST /subscription-plans */
  create: async (data: CreateSubscriptionPlanPayload): Promise<SubscriptionPlan> => {
    const res = await api.post<SubscriptionPlan>('/subscription-plans', data);
    return res.data;
  },

  /** PATCH /subscription-plans/:id */
  update: async (
    id: string,
    data: UpdateSubscriptionPlanPayload,
  ): Promise<SubscriptionPlan> => {
    const res = await api.patch<SubscriptionPlan>(`/subscription-plans/${id}`, data);
    return res.data;
  },

  /** DELETE /subscription-plans/:id — deactivate */
  deactivate: async (id: string): Promise<SubscriptionPlan> => {
    const res = await api.delete<SubscriptionPlan>(`/subscription-plans/${id}`);
    return res.data;
  },
};
