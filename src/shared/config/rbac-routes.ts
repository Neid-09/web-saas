import type { UserRole } from "@/modules/auth/domain/user-role";

export interface RoutePermissionRule {
	pathPrefix: string;
	allowedRoles: UserRole[];
}

/**
 * Matriz maestra declarativa de acceso a rutas del sistema (RBAC).
 * Fuente única de verdad basada en la especificación oficial de Squad 1.
 * Las rutas más específicas van primero.
 */
export const ROUTE_PERMISSIONS: RoutePermissionRule[] = [
	// 1. Mostrador de Punto de Venta (E4/E5): Exclusivo para cajeros
	{
		pathPrefix: "/pos",
		allowedRoles: ["CASHIER"],
	},

	// 2. Submódulos administrativos restringidos
	{
		pathPrefix: "/dashboard/company",
		allowedRoles: ["OWNER"],
	},
	{
		pathPrefix: "/dashboard/accounting",
		allowedRoles: ["OWNER", "ACCOUNTANT"],
	},
	{
		pathPrefix: "/dashboard/inventory",
		allowedRoles: ["OWNER", "ADMIN", "WAREHOUSE_MANAGER"],
	},

	// 3. Panel administrativo general (E4 Backoffice)
	{
		pathPrefix: "/dashboard",
		allowedRoles: ["OWNER", "ADMIN", "ACCOUNTANT", "WAREHOUSE_MANAGER"],
	},
];

/**
 * Helper para obtener la lista de roles autorizados para un prefijo de ruta.
 */
export function rolesFor(prefix: string): UserRole[] {
	const rule = ROUTE_PERMISSIONS.find((r) => r.pathPrefix === prefix);
	return rule ? rule.allowedRoles : [];
}

/**
 * Destino inicial predeterminado (Home) según el rol del usuario tras autenticación.
 */
export const ROLE_HOME_REDIRECT: Record<UserRole, string> = {
	CASHIER: "/pos",
	OWNER: "/dashboard",
	ADMIN: "/dashboard",
	ACCOUNTANT: "/dashboard",
	WAREHOUSE_MANAGER: "/dashboard",
};
