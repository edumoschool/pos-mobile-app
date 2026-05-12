import api from './client';
import type {
  Inventory,
  CreateInventoryPayload,
  UpdateInventoryPayload,
  InventoryMovement,
} from '@/types';

export const inventoryApi = {
  /** GET /inventory — list all inventory for the tenant */
  getAll: async (): Promise<Inventory[]> => {
    const res = await api.get<Inventory[]>('/inventory');
    return res.data;
  },

  /** GET /inventory/:id — includes product, supplier, and last 20 movements */
  getById: async (id: string): Promise<Inventory & { movements: InventoryMovement[] }> => {
    const res = await api.get<Inventory & { movements: InventoryMovement[] }>(`/inventory/${id}`);
    return res.data;
  },

  /** GET /inventory/low-stock — items where quantity <= minQuantity */
  getLowStock: async (): Promise<Inventory[]> => {
    const res = await api.get<Inventory[]>('/inventory/low-stock');
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
   * GET /inventory/movements?inventoryId= — list movement history.
   * Omit inventoryId to get all movements for the tenant.
   */
  getMovements: async (inventoryId?: string): Promise<InventoryMovement[]> => {
    const res = await api.get<InventoryMovement[]>('/inventory/movements', {
      params: inventoryId ? { inventoryId } : undefined,
    });
    return res.data;
  },
};
