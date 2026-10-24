import type { UserRole } from "@/modules/auth/domain/user-role";
import type { DashboardNavSection } from "./types";
import { ACTIVE_NAV_MODULES } from "./manifest";
import { assembleNavSections } from "./registry";

/**
 * Caché precomputado en memoria al inicializarse el módulo.
 * El motor ensambla y filtra los módulos una sola vez por cada rol del sistema,
 * garantizando complejidad O(1) y cero bucles en tiempo de render.
 */
const PRECOMPUTED_NAV: Record<UserRole, DashboardNavSection[]> = {
	OWNER: assembleNavSections(ACTIVE_NAV_MODULES, "OWNER"),
	ADMIN: assembleNavSections(ACTIVE_NAV_MODULES, "ADMIN"),
	ACCOUNTANT: assembleNavSections(ACTIVE_NAV_MODULES, "ACCOUNTANT"),
	WAREHOUSE_MANAGER: assembleNavSections(ACTIVE_NAV_MODULES, "WAREHOUSE_MANAGER"),
	CASHIER: assembleNavSections(ACTIVE_NAV_MODULES, "CASHIER"),
};

/**
 * Retorna las secciones de navegación del rol solicitado desde memoria estática.
 * Complejidad O(1): Lectura inmediata por clave, sin iteraciones ni filtros en caliente.
 */
export function getAuthorizedNavSections(
	role?: UserRole,
): DashboardNavSection[] {
	if (!role) return [];
	return PRECOMPUTED_NAV[role] ?? [];
}
