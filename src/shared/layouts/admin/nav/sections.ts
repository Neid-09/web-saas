import type { NavSectionDefinition, NavSectionId } from "./types";

/**
 * Catálogo maestro de secciones de navegación lateral del Shell Administrativo.
 * Define la estructura semántica y orden de presentación de los módulos.
 */
export const NAV_SECTIONS: Record<NavSectionId, NavSectionDefinition> = {
	general: {
		id: "general",
		title: "PANEL PRINCIPAL",
		order: 1,
	},
	administration: {
		id: "administration",
		title: "ADMINISTRACIÓN",
		order: 2,
	},
	operations: {
		id: "operations",
		title: "OPERACIONES",
		order: 3,
	},
	reports: {
		id: "reports",
		title: "REPORTES & AUDITORÍA",
		order: 4,
	},
};
