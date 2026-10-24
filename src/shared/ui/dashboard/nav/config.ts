import type { UserRole } from "@/modules/auth/domain/user-role";
import type { DashboardNavSection } from "./types";
import { DASHBOARD_NAV_SECTIONS } from "./data";

/**
 * Filtra las secciones y sus ítems de navegación según el rol del usuario autenticado.
 * Si una sección queda sin ítems autorizados, no se incluye en el resultado.
 */
export function getAuthorizedNavSections(
	role?: UserRole,
): DashboardNavSection[] {
	if (!role) return [];

	return DASHBOARD_NAV_SECTIONS.map((section) => ({
		...section,
		items: section.items.filter((item) => item.allowedRoles.includes(role)),
	})).filter((section) => section.items.length > 0);
}
