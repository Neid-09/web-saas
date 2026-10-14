import {
	ROUTE_PERMISSIONS,
	ROLE_HOME_REDIRECT,
} from "@/shared/config/rbac-routes";
import type { UserRole } from "@/modules/auth/domain/auth.types";

const matches = (path: string, prefix: string) =>
	path === prefix || path.startsWith(prefix + "/");

const RULES = [...ROUTE_PERMISSIONS].sort(
	(a, b) => b.pathPrefix.length - a.pathPrefix.length,
);

/**
 * Valida y resuelve una URL de redirección segura post-login.
 * - Protege contra ataques Open Redirect (CWE-601): bloquea URLs externas, relativas al protocolo y escapes.
 * - Previene bucles infinitos hacia /login.
 * - Aplica matriz RBAC: si el rol no tiene permiso para la ruta solicitada, cae al fallback de su rol.
 * - Preserva parámetros de consulta y hashes legítimos del usuario.
 */
export function safeRedirect(
	target: string | null | undefined,
	role: UserRole,
): string {
	const fallback = ROLE_HOME_REDIRECT[role] || "/dashboard";

	if (!target) return fallback;

	// Solo rutas internas
	if (
		!target.startsWith("/") ||
		target.startsWith("//") ||
		target.startsWith("/\\")
	) {
		return fallback;
	}

	const path = target.split(/[?#]/)[0];

	// Evitar bucle de login
	if (matches(path, "/login")) return fallback;

	// No mandar a una sección que rechazaría a este rol
	const rule = RULES.find((r) => matches(path, r.pathPrefix));
	if (rule && !rule.allowedRoles.includes(role)) return fallback;

	return target;
}
