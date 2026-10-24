import { LayoutDashboard } from "lucide-react";
import type { ModuleNavContribution } from "./types";

/**
 * Contribución de navegación del Dashboard principal (Inicio & Métricas).
 * Ítem transversal disponible para todos los roles con acceso al Shell Administrativo.
 */
export const homeNav: ModuleNavContribution = {
	sectionId: "general",
	order: 1,
	item: {
		id: "dashboard-home",
		label: "Inicio & Métricas",
		href: "/dashboard",
		icon: LayoutDashboard,
		allowedRoles: ["OWNER", "ADMIN", "ACCOUNTANT", "WAREHOUSE_MANAGER"],
		isExactMatch: true,
		order: 1,
	},
};
