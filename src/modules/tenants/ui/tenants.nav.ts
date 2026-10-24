import { Building2 } from "lucide-react";
import type { ModuleNavContribution } from "@/shared/layouts";

/**
 * Contribución de navegación del módulo Tenants.
 * Exclusivo para el rol OWNER (Gobernanza de la plataforma Multi-Tenant).
 */
export const tenantsNav: ModuleNavContribution = {
	sectionId: "general",
	order: 2,
	item: {
		id: "dashboard-tenants",
		label: "Empresas (Tenants)",
		href: "/dashboard/tenants",
		icon: Building2,
		allowedRoles: ["OWNER"],
		order: 2,
	},
};
