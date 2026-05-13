import api from './client';
import type {
  Inventory,
  CreateInventoryPayload,
  UpdateInventoryPayload,
  InventoryMovement,
  PaginatedResponse,
  PaginationQuery,
} from '@/types';

export const inventoryApi = {
  /** GET /inventory?page=&limit= — list all inventory for the tenant */
  getAll: async (params?: PaginationQuery): Promise<PaginatedResponse<Inventory>> => {
    const res = await api.get<PaginatedResponse<Inventory>>('/inventory', { params });
    return res.data;
  },

  /** GET /inventory/:id — includes product, supplier, and last 20 movements */
  getById: async (id: string): Promise<Inventory & { movements: InventoryMovement[] }> => {
    const res = await api.get<Inventory & { movements: InventoryMovement[] }>(`/inventory/${id}`);
    return res.data;
  },

  /** GET /inventory/low-stock?page=&limit= — items where quantity <= minQuantity */
  getLowStock: async (params?: PaginationQuery): Promise<PaginatedResponse<Inventory>> => {
    const res = await api.get<PaginatedResponse<Inventory>>('/inventory/low-stock', { params });
    return res.data;
  },

  /** POST /inventory — create a new inventory record */
  create: async (data: CreateInventoryPayload): Promise<Inventory> => {
    const res = await api.post<Inventory>('/inventory', data);
    return res.data;
  },

  /**
   * PATCH /inventory/:id — adjust inventory.
   * If `quantity` changes, the backend auto-creates an InventoryMovement
   * and checks for low-stock push notifications.
   */
  adjust: async (id: string, data: UpdateInventoryPayload): Promise<Inventory> => {
    const res = await api.patch<Inventory>(`/inventory/${id}`, data);
    return res.data;
  },

  /** DELETE /inventory/:id — permanently delete an inventory record */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },

  /**
   * GET /inventory/movements?inventoryId=&page=&limit= — list movement history.
   * Omit inventoryId to get all movements for the tenant.
   */
  getMovements: async (params?: PaginationQuery & { inventoryId?: string }): Promise<PaginatedResponse<InventoryMovement>> => {
    const res = await api.get<PaginatedResponse<InventoryMovement>>('/inventory/movements', { params });
    return res.data;
  },
};
