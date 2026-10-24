import {
	LayoutDashboard,
	Store,
	Users,
	Boxes,
	UserCheck,
	Truck,
	Building2,
} from "lucide-react";
import type { DashboardNavSection } from "./types";

/**
 * Matriz declarativa de navegación lateral del Shell Administrativo.
 * Inicialmente acotada de forma estricta al rol OWNER; los demás roles
 * se irán incorporando progresivamente en sus fases respectivas.
 */
export const DASHBOARD_NAV_SECTIONS: DashboardNavSection[] = [
	{
		id: "general",
		title: "PANEL PRINCIPAL",
		items: [
			{
				id: "dashboard-home",
				label: "Inicio & Métricas",
				href: "/dashboard",
				icon: LayoutDashboard,
				allowedRoles: ["OWNER"],
				isExactMatch: true,
			},
			{
				id: "dashboard-company",
				label: "Empresa & Fiscal",
				href: "/dashboard/company",
				icon: Building2,
				allowedRoles: ["OWNER"],
			},
		],
	},
	{
		id: "administration",
		title: "ADMINISTRACIÓN",
		items: [
			{
				id: "dashboard-branches",
				label: "Sucursales & Sedes",
				href: "/dashboard/branches",
				icon: Store,
				allowedRoles: ["OWNER"],
			},
			{
				id: "dashboard-users",
				label: "Personal & Usuarios",
				href: "/dashboard/users",
				icon: Users,
				allowedRoles: ["OWNER"],
			},
			{
				id: "dashboard-inventory",
				label: "Inventario & Catálogo",
				href: "/dashboard/inventory",
				icon: Boxes,
				allowedRoles: ["OWNER"],
			},
			{
				id: "dashboard-customers",
				label: "Clientes & Fiados",
				href: "/dashboard/customers",
				icon: UserCheck,
				allowedRoles: ["OWNER"],
			},
			{
				id: "dashboard-suppliers",
				label: "Proveedores & Compras",
				href: "/dashboard/suppliers",
				icon: Truck,
				allowedRoles: ["OWNER"],
			},
		],
	},
];
