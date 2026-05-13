import api from './client';
import type {
  Category,
  CreateCategoryPayload,
  BrandCategory,
  CreateBrandCategoryPayload,
  Unit,
  CreateUnitPayload,
  ExpenseCategory,
  CreateExpenseCategoryPayload,
  IncomeCategory,
  CreateIncomeCategoryPayload,
  PaginatedResponse,
} from '@/types';

// ─── Product Categories ─────────────────────────────────────────────────────

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get<PaginatedResponse<Category>>('/categories', { params: { limit: 100 } });
    return res.data.data;
  },
  getById: async (id: string): Promise<Category> => {
    const res = await api.get<Category>(`/categories/${id}`);
    return res.data;
  },
  create: async (data: CreateCategoryPayload): Promise<Category> => {
    const res = await api.post<Category>('/categories', data);
    return res.data;
  },
  update: async (id: string, data: Partial<CreateCategoryPayload>): Promise<Category> => {
    const res = await api.patch<Category>(`/categories/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// ─── Brand Categories ───────────────────────────────────────────────────────

export const brandCategoriesApi = {
  getAll: async (): Promise<BrandCategory[]> => {
    const res = await api.get<PaginatedResponse<BrandCategory>>('/brand-categories', { params: { limit: 100 } });
    return res.data.data;
  },
  getById: async (id: string): Promise<BrandCategory> => {
    const res = await api.get<BrandCategory>(`/brand-categories/${id}`);
    return res.data;
  },
  create: async (data: CreateBrandCategoryPayload): Promise<BrandCategory> => {
    const res = await api.post<BrandCategory>('/brand-categories', data);
    return res.data;
  },
  update: async (id: string, data: Partial<CreateBrandCategoryPayload>): Promise<BrandCategory> => {
    const res = await api.patch<BrandCategory>(`/brand-categories/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/brand-categories/${id}`);
  },
};

// ─── Units ──────────────────────────────────────────────────────────────────

export const unitsApi = {
  getAll: async (): Promise<Unit[]> => {
    const res = await api.get<PaginatedResponse<Unit>>('/units', { params: { limit: 100 } });
    return res.data.data;
  },
  getById: async (id: string): Promise<Unit> => {
    const res = await api.get<Unit>(`/units/${id}`);
    return res.data;
  },
  create: async (data: CreateUnitPayload): Promise<Unit> => {
    const res = await api.post<Unit>('/units', data);
    return res.data;
  },
  update: async (id: string, data: Partial<CreateUnitPayload>): Promise<Unit> => {
    const res = await api.patch<Unit>(`/units/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/units/${id}`);
  },
};

// ─── Expense Categories ─────────────────────────────────────────────────────

export const expenseCategoriesApi = {
  getAll: async (): Promise<ExpenseCategory[]> => {
    const res = await api.get<PaginatedResponse<ExpenseCategory>>('/expense-categories', { params: { limit: 100 } });
    return res.data.data;
  },
  getById: async (id: string): Promise<ExpenseCategory> => {
    const res = await api.get<ExpenseCategory>(`/expense-categories/${id}`);
    return res.data;
  },
  create: async (data: CreateExpenseCategoryPayload): Promise<ExpenseCategory> => {
    const res = await api.post<ExpenseCategory>('/expense-categories', data);
    return res.data;
  },
  update: async (id: string, data: Partial<CreateExpenseCategoryPayload>): Promise<ExpenseCategory> => {
    const res = await api.patch<ExpenseCategory>(`/expense-categories/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/expense-categories/${id}`);
  },
};

// ─── Income Categories ──────────────────────────────────────────────────────

export const incomeCategoriesApi = {
  getAll: async (): Promise<IncomeCategory[]> => {
    const res = await api.get<PaginatedResponse<IncomeCategory>>('/income-categories', { params: { limit: 100 } });
    return res.data.data;
  },
  getById: async (id: string): Promise<IncomeCategory> => {
    const res = await api.get<IncomeCategory>(`/income-categories/${id}`);
    return res.data;
  },
  create: async (data: CreateIncomeCategoryPayload): Promise<IncomeCategory> => {
    const res = await api.post<IncomeCategory>('/income-categories', data);
    return res.data;
  },
  update: async (id: string, data: Partial<CreateIncomeCategoryPayload>): Promise<IncomeCategory> => {
    const res = await api.patch<IncomeCategory>(`/income-categories/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/income-categories/${id}`);
  },
};
