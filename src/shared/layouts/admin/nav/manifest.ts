import type { ModuleNavContribution } from "./types";
import { homeNav } from "./home.nav";
import { tenantsNav } from "@/modules/tenants/ui/tenants.nav";

/**
 * Manifiesto declarativo de módulos conectados a la navegación del Shell.
 * Punto único de montaje: cada nuevo módulo del SaaS se registra aquí en una sola línea.
 */
export const ACTIVE_NAV_MODULES: ModuleNavContribution[] = [
	homeNav,
	tenantsNav,
	// Futuras contribuciones de módulos del Diplomado:
	// branchesNav,
	// usersNav,
	// inventoryNav,
	// accountingNav,
];
