import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/modules/auth/domain/user-role";

export interface DashboardNavItem {
	id: string;
	label: string;
	href: string;
	icon: LucideIcon;
	allowedRoles: UserRole[];
	badgeCount?: number;
	isExactMatch?: boolean;
}

export interface DashboardNavSection {
	id: string;
	title?: string;
	items: DashboardNavItem[];
}
