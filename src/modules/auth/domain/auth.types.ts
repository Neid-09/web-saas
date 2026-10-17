import type { UserRole } from "./user-role";

/**
 * Entidad de dominio que representa la sesión del usuario comercial.
 */
export interface UserSession {
	id: string;
	fullName?: string;
	role: UserRole;
	tenantId: string;
	branchId?: string;
	tenantName?: string;
	branchName?: string;
}
