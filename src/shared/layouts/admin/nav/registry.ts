import type { UserRole } from "@/modules/auth/domain/user-role";
import type {
	DashboardNavItem,
	DashboardNavSection,
	ModuleNavContribution,
} from "./types";
import { NAV_SECTIONS } from "./sections";

/**
 * Motor puro de ensamblaje de navegación:
 * 1. Filtra los ítems autorizados para el rol solicitado.
 * 2. Agrupa los ítems en sus secciones correspondientes.
 * 3. Ordena secciones e ítems según sus prioridades declaradas.
 * 4. Descarta automáticamente secciones sin ítems autorizados.
 */
export function assembleNavSections(
	contributions: ModuleNavContribution[],
	role?: UserRole,
): DashboardNavSection[] {
	if (!role || !contributions.length) return [];

	const sectionsMap = new Map<
		string,
		{ title?: string; order: number; items: DashboardNavItem[] }
	>();

	for (const contribution of contributions) {
		const { sectionId, item, order: itemOrder = 99 } = contribution;

		// Validar autorización del rol sobre el ítem
		if (!item.allowedRoles.includes(role)) {
			continue;
		}

		if (!sectionsMap.has(sectionId)) {
			const sectionDef = NAV_SECTIONS[sectionId] ?? {
				id: sectionId,
				title: sectionId.toUpperCase(),
				order: 99,
			};

			sectionsMap.set(sectionId, {
				title: sectionDef.title,
				order: sectionDef.order,
				items: [],
			});
		}

		const section = sectionsMap.get(sectionId)!;
		section.items.push({
			...item,
			order: item.order ?? itemOrder,
		});
	}

	// Ordenar secciones y sus ítems internos de manera determinística
	return Array.from(sectionsMap.entries())
		.sort(([, a], [, b]) => a.order - b.order)
		.map(([id, section]) => ({
			id,
			title: section.title,
			items: section.items.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
		}));
}
