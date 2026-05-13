import api from './client';
import type {
  FinancialSummary,
  TransactionsByDayItem,
  CategoryBreakdownItem,
  InventoryReport,
  PartyBalanceSummary,
  DateRangeQuery,
  ExportReportPayload,
  Report,
  ExportedReportUrl,
  PaginatedResponse,
} from '@/types';

export const reportsApi = {
  // ─── Analytics endpoints (owner/super_admin only) ────────────────────

  /** GET /reports/financial-summary?branchId=&from=&to= */
  financialSummary: async (query?: DateRangeQuery): Promise<FinancialSummary> => {
    const res = await api.get<FinancialSummary>('/reports/financial-summary', { params: query });
    return res.data;
  },

  /** GET /reports/transactions-by-day?branchId=&from=&to= */
  transactionsByDay: async (query?: DateRangeQuery): Promise<TransactionsByDayItem[]> => {
    const res = await api.get<PaginatedResponse<TransactionsByDayItem>>('/reports/transactions-by-day', { params: { ...query, limit: 1000 } });
    return res.data.data;
  },

  /** GET /reports/expenses-by-category?branchId=&from=&to= */
  expensesByCategory: async (query?: DateRangeQuery): Promise<CategoryBreakdownItem[]> => {
    const res = await api.get<PaginatedResponse<CategoryBreakdownItem>>('/reports/expenses-by-category', { params: { ...query, limit: 100 } });
    return res.data.data;
  },

  /** GET /reports/income-by-category?branchId=&from=&to= */
  incomeByCategory: async (query?: DateRangeQuery): Promise<CategoryBreakdownItem[]> => {
    const res = await api.get<PaginatedResponse<CategoryBreakdownItem>>('/reports/income-by-category', { params: { ...query, limit: 100 } });
    return res.data.data;
  },

  /** GET /reports/inventory — stock values and low-stock items */
  inventoryReport: async (): Promise<InventoryReport> => {
    const res = await api.get<InventoryReport>('/reports/inventory');
    return res.data;
  },

  /** GET /reports/client-balances — all client income/outcome balances */
  clientBalances: async (): Promise<PartyBalanceSummary[]> => {
    const res = await api.get<PaginatedResponse<PartyBalanceSummary>>('/reports/client-balances', { params: { limit: 1000 } });
    return res.data.data;
  },

  /** GET /reports/supplier-balances — all supplier income/outcome balances */
  supplierBalances: async (): Promise<PartyBalanceSummary[]> => {
    const res = await api.get<PaginatedResponse<PartyBalanceSummary>>('/reports/supplier-balances', { params: { limit: 1000 } });
    return res.data.data;
  },

  /** GET /reports/top-products?limit= — active products list */
  topProducts: async (limit?: number): Promise<any[]> => {
    const res = await api.get('/reports/top-products', { params: limit ? { limit } : undefined });
    return res.data;
  },

  // ─── Report export / download ────────────────────────────────────────

  /** POST /reports/export — generate & upload report file (pdf/excel/csv) */
  exportReport: async (data: ExportReportPayload): Promise<Report> => {
    const res = await api.post<Report>('/reports/export', data);
    return res.data;
  },

  /** GET /reports/exports — list all previously exported reports */
  listExports: async (): Promise<Report[]> => {
    const res = await api.get<PaginatedResponse<Report>>('/reports/exports', { params: { limit: 100 } });
    return res.data.data;
  },

  /** GET /reports/exports/:id/url — get temporary download URL */
  getExportUrl: async (id: string): Promise<ExportedReportUrl> => {
    const res = await api.get<ExportedReportUrl>(`/reports/exports/${id}/url`);
    return res.data;
  },

  /** DELETE /reports/exports/:id — delete an exported report */
  deleteExport: async (id: string): Promise<void> => {
    await api.delete(`/reports/exports/${id}`);
  },
};
