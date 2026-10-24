import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/modules/auth/domain/user-role";

export type NavSectionId = "general" | "administration" | "operations" | "reports";

export interface DashboardNavItem {
	id: string;
	label: string;
	href: string;
	icon: LucideIcon;
	allowedRoles: UserRole[];
	badgeCount?: number;
	isExactMatch?: boolean;
	order?: number;
}

export interface DashboardNavSection {
	id: string;
	title?: string;
	items: DashboardNavItem[];
}

export interface NavSectionDefinition {
	id: NavSectionId;
	title?: string;
	order: number;
}

/**
 * Contrato que exporta cada módulo (Vertical Slice) para declarar su presencia en la navegación.
 */
export interface ModuleNavContribution {
	sectionId: NavSectionId;
	order?: number;
	item: DashboardNavItem;
}
