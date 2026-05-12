/**
 * POS API — Barrel export
 *
 * Import individual modules or re-export everything:
 *   import { authApi, productsApi } from '@/api';
 */

export { default as api, getApiErrorMessage, setOnUnauthorized } from './client';
export { storage } from './storage';
export { API_URL } from './config';

export { authApi } from './auth';
export { usersApi } from './users';
export { branchesApi } from './branches';
export { productsApi } from './products';
export { inventoryApi } from './inventory';
export {
  categoriesApi,
  brandCategoriesApi,
  unitsApi,
  expenseCategoriesApi,
  incomeCategoriesApi,
} from './catalog';
export { clientsApi, suppliersApi } from './partners';
export { transactionsApi } from './transactions';
export { clientTransactionsApi, supplierTransactionsApi } from './party-transactions';
export { reportsApi } from './reports';
export { exchangeRatesApi } from './exchange-rates';
export { notificationsApi } from './notifications';
