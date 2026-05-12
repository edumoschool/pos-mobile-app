// ============================================================================
// POS System — Complete TypeScript Type Definitions
// Generated from pos-backend Prisma schema + NestJS DTOs + service responses
// ============================================================================

// ─── Enums ──────────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'owner' | 'seller';
export type Language = 'en' | 'uz' | 'ru';
export type Currency = 'UZS' | 'USD';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';
export type TransactionType = 'income' | 'expense';
export type InventoryMovementType = 'in' | 'out' | 'adjustment';
export type PartyTransactionType = 'income' | 'outcome';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';
export type ReportFormat = 'pdf' | 'excel' | 'csv';
export type ExportReportType =
  | 'financial-summary'
  | 'transactions-by-day'
  | 'expenses-by-category'
  | 'income-by-category'
  | 'inventory'
  | 'client-balances'
  | 'supplier-balances';
export type InventoryStatus = 'in-stock' | 'low-stock';

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  phone: string;
  password: string;
  fullName: string;
  tenantName: string;
  language?: Language;
}

/** Returned by POST /auth/login and POST /auth/register */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

/** JWT payload shape (decoded from accessToken) */
export interface JwtPayload {
  sub: string; // userId
  phone: string;
  role: UserRole;
  tenantId: string;
  branchId: string | null;
  sessionId: string;
  iat: number;
  exp: number;
}

// ─── User ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  phone: string;
  fullName: string;
  role: UserRole;
  tenantId: string | null;
  branchId: string | null;
  language: Language;
  expoPushToken: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Included when fetched via GET /auth/profile
  tenant?: Tenant;
  branch?: Branch;
}

export interface CreateUserPayload {
  phone: string;
  password: string;
  fullName: string;
  role?: UserRole;
  branchId?: string;
  language?: Language;
  isActive?: boolean;
}

export interface UpdateUserPayload {
  fullName?: string;
  role?: UserRole;
  branchId?: string;
  language?: Language;
  isActive?: boolean;
  password?: string;
}

export interface ChangeLanguagePayload {
  language: Language;
}

// ─── Session ────────────────────────────────────────────────────────────────

export interface Session {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  isCurrent: boolean;
  createdAt: string;
  expiresAt: string;
}

// ─── SSE Events ─────────────────────────────────────────────────────────────

export type SseEventType = 'session_revoked' | 'user_deactivated';

export interface SseEvent {
  type: SseEventType;
}

// ─── Tenant ─────────────────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  name: string;
  ownerPhone: string;
  language: Language;
  subscriptionPlanId: string | null;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subscriptionPlan?: SubscriptionPlan;
}

// ─── Subscription Plan ──────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationDays: number;
  maxBranches: number;
  maxUsers: number;
  maxProducts: number;
  features: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: string;
}

// ─── Branch ─────────────────────────────────────────────────────────────────

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBranchPayload {
  name: string;
  address?: string;
  phone?: string;
}

export interface UpdateBranchPayload {
  name?: string;
  address?: string;
  phone?: string;
  isActive?: boolean;
}

// ─── Unit ───────────────────────────────────────────────────────────────────

export interface Unit {
  id: string;
  tenantId: string;
  name: string;
  shortName: string;
  createdAt: string;
}

export interface CreateUnitPayload {
  name: string;
  shortName: string;
}

// ─── Category ───────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

// ─── Brand Category ─────────────────────────────────────────────────────────

export interface BrandCategory {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CreateBrandCategoryPayload {
  name: string;
  description?: string;
}

// ─── Expense / Income Categories ────────────────────────────────────────────

export interface ExpenseCategory {
  id: string;
  tenantId: string;
  name: string;
  createdAt: string;
}

export interface IncomeCategory {
  id: string;
  tenantId: string;
  name: string;
  createdAt: string;
}

export interface CreateExpenseCategoryPayload {
  name: string;
}

export interface CreateIncomeCategoryPayload {
  name: string;
}

// ─── Product ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string | null;
  brandCategoryId: string | null;
  unitId: string | null;
  name: string;
  description: string | null;
  costPrice: number;
  sellingPrice: number;
  currency: Currency;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Included relations
  category?: Category | null;
  brandCategory?: BrandCategory | null;
  unit?: Unit | null;
  inventory?: Inventory[];
  /** Computed by backend: 'in-stock' or 'low-stock' */
  inventoryStatus?: InventoryStatus;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  categoryId?: string;
  brandCategoryId?: string;
  unitId?: string;
  costPrice?: number;
  sellingPrice?: number;
  currency?: Currency;
  imageUrl?: string;
  isActive?: boolean;
  /** Initial inventory quantity (auto-creates inventory record) */
  quantity?: number;
  /** Low-stock alert threshold */
  minQuantity?: number;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  categoryId?: string;
  brandCategoryId?: string;
  unitId?: string;
  costPrice?: number;
  sellingPrice?: number;
  currency?: Currency;
  isActive?: boolean;
}

// ─── Inventory ──────────────────────────────────────────────────────────────

export interface Inventory {
  id: string;
  productId: string;
  tenantId: string;
  supplierId: string | null;
  quantity: number;
  minQuantity: number | null;
  maxQuantity: number | null;
  costPrice: number;
  costCurrency: Currency;
  location: string | null;
  updatedAt: string;
  // Included relations
  product?: { id: string; name: string; sellingPrice?: number; currency?: Currency; unit?: Unit | null };
  supplier?: { id: string; name: string } | null;
  movements?: InventoryMovement[];
}

export interface CreateInventoryPayload {
  productId: string;
  supplierId?: string;
  quantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  costPrice?: number;
  costCurrency?: Currency;
  location?: string;
}

export interface UpdateInventoryPayload {
  supplierId?: string;
  quantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  costPrice?: number;
  costCurrency?: Currency;
  location?: string;
  /** Note explaining the adjustment */
  note?: string;
}

// ─── Inventory Movement ─────────────────────────────────────────────────────

export interface InventoryMovement {
  id: string;
  inventoryId: string;
  tenantId: string;
  branchId: string | null;
  userId: string;
  type: InventoryMovementType;
  quantity: number;
  before: number;
  after: number;
  note: string | null;
  createdAt: string;
  // Included relations
  inventory?: Inventory;
  user?: { id: string; fullName: string };
}

// ─── Client ─────────────────────────────────────────────────────────────────

export interface Client {
  id: string;
  tenantId: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateClientPayload {
  fullName: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface UpdateClientPayload {
  fullName?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

// ─── Supplier ───────────────────────────────────────────────────────────────

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierPayload {
  name: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface UpdateSupplierPayload {
  name?: string;
  phone?: string;
  address?: string;
  notes?: string;
  isActive?: boolean;
}

// ─── Transaction (income / expense) ─────────────────────────────────────────

export interface Transaction {
  id: string;
  tenantId: string;
  branchId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  expenseCategoryId: string | null;
  incomeCategoryId: string | null;
  description: string | null;
  createdAt: string;
  // Included relations
  expenseCategory?: ExpenseCategory | null;
  incomeCategory?: IncomeCategory | null;
  user?: { id: string; fullName: string };
  branch?: { id: string; name: string };
}

export interface CreateTransactionPayload {
  branchId: string;
  type: TransactionType;
  amount: number;
  currency?: Currency;
  expenseCategoryId?: string;
  incomeCategoryId?: string;
  description?: string;
}

export interface UpdateTransactionPayload {
  branchId?: string;
  type?: TransactionType;
  amount?: number;
  currency?: Currency;
  expenseCategoryId?: string;
  incomeCategoryId?: string;
  description?: string;
}

// ─── Client Transaction (debt / payment tracking) ───────────────────────────

export interface ClientTransaction {
  id: string;
  tenantId: string;
  clientId: string;
  userId: string;
  type: PartyTransactionType;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod | null;
  description: string | null;
  dueDate: string | null;
  createdAt: string;
  // Included relations
  client?: { id: string; fullName: string; phone: string | null };
  user?: { id: string; fullName: string };
}

export interface CreateClientTransactionPayload {
  clientId: string;
  /** income = client pays us; outcome = debt issued to client */
  type: PartyTransactionType;
  amount: number;
  currency?: Currency;
  paymentMethod?: PaymentMethod;
  description?: string;
}

// ─── Supplier Transaction ───────────────────────────────────────────────────

export interface SupplierTransaction {
  id: string;
  tenantId: string;
  supplierId: string;
  userId: string;
  type: PartyTransactionType;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod | null;
  description: string | null;
  createdAt: string;
  // Included relations
  supplier?: { id: string; name: string; phone: string | null };
  user?: { id: string; fullName: string };
}

export interface CreateSupplierTransactionPayload {
  supplierId: string;
  /** income = supplier refunds us; outcome = we pay supplier */
  type: PartyTransactionType;
  amount: number;
  currency?: Currency;
  paymentMethod?: PaymentMethod;
  description?: string;
}

// ─── Exchange Rate ──────────────────────────────────────────────────────────

export interface ExchangeRate {
  id: string;
  date: string;
  usdToUzs: number;
  createdAt: string;
}

export interface ConvertResult {
  from: Currency;
  to: Currency;
  amount: number;
  result: number;
  rate: number;
}

// ─── Reports ────────────────────────────────────────────────────────────────

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
}

export interface TransactionsByDayItem {
  date: string;
  count: number;
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryBreakdownItem {
  id: string | null;
  name: string;
  totalAmount: number;
  transactionCount: number;
}

export interface InventoryReportItem {
  inventoryId: string;
  product: { id: string; name: string; costPrice: number; sellingPrice: number; currency: Currency };
  supplier: { id: string; name: string } | null;
  quantity: number;
  minQuantity: number | null;
  maxQuantity: number | null;
  costPrice: number;
  costCurrency: Currency;
  location: string | null;
  isLowStock: boolean;
  stockValue: number;
}

export interface InventoryReport {
  totalItems: number;
  totalStockValue: number;
  lowStockCount: number;
  items: InventoryReportItem[];
}

export interface PartyBalanceSummary {
  id: string;
  fullName?: string;
  name?: string;
  phone: string | null;
  balanceUzs: number;
  balanceUsd: number;
  transactionCount: number;
}

export interface ClientBalanceDetail {
  client: Client;
  balanceUzs: number;
  balanceUsd: number;
  transactions: ClientTransaction[];
}

export interface SupplierBalanceDetail {
  supplier: Supplier;
  balanceUzs: number;
  balanceUsd: number;
  transactions: SupplierTransaction[];
}

// ─── Report Export ──────────────────────────────────────────────────────────

export interface ExportReportPayload {
  reportType: ExportReportType;
  format: ReportFormat;
  branchId?: string;
  from?: string;
  to?: string;
}

export interface Report {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  format: ReportFormat;
  objectKey: string;
  size: number | null;
  createdAt: string;
}

export interface ExportedReportUrl {
  url: string;
}

export interface ExcelExportResult {
  url: string;
  fileName: string;
}

// ─── Notifications ──────────────────────────────────────────────────────────

export interface RegisterTokenPayload {
  token: string;
}

export interface SendNotificationPayload {
  to?: string | string[];
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  priority?: 'default' | 'normal' | 'high';
  ttl?: number;
  sound?: string | null;
  badge?: number;
  channelId?: string;
  subtitle?: string;
  categoryId?: string;
  mutableContent?: boolean;
}

// ─── Generic API helpers ────────────────────────────────────────────────────

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface MessageResponse {
  message: string;
}

/** Query params shared by many report endpoints */
export interface DateRangeQuery {
  branchId?: string;
  from?: string;
  to?: string;
}

/** Query params for client listing */
export interface ClientListQuery {
  search?: string;
  sortBy?: 'createdAt' | 'clientTransAmount' | 'alphabetic';
  order?: 'asc' | 'desc';
}