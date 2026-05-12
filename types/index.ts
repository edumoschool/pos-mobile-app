// ============================================================================
// POS System Types
// ============================================================================

export type UserRole = 'super_admin' | 'owner' | 'seller';

// --- Auth ---
export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  phone: string;
  password: string;
  fullName: string;
  tenantName: string;
  language?: 'en' | 'uz' | 'ru';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: string;
  phone: string;
  fullName: string;
  role: UserRole;
  tenantId: string;
  branchId: string | null;
  isActive?: boolean;
  language?: string;
}



// --- Session ---
export interface Session {
  id: string;
  ipAddress: string;
  userAgent: string;
  isCurrent: boolean;
  createdAt: string;
  expiresAt: string;
}


// --- API Error ---
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

// --- User Management ---
export interface CreateUserPayload {
  phone: string;
  password: string;
  fullName: string;
  role?: UserRole;
  branchId?: string;
  language?: string;
}