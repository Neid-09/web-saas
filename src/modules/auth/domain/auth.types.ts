/**
 * Roles autorizados en el sistema comercial del Tenant.
 * Concepto puro de negocio, sin librerías externas.
 */
export type UserRole = 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'WAREHOUSE_MANAGER' | 'CASHIER';

/**
 * Entidad de dominio que representa la sesión del usuario comercial.
 */
export interface UserSession {
  id: string;
  fullName?: string;
  email: string;
  role: UserRole;
  tenantId: string;
  branchId: string;
  tenantName?: string;
  branchName?: string;
}
