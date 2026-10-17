"use client";

import { useCallback } from "react";
import { useSession } from "../session-provider";
import type { UserRole } from "@/modules/auth/domain/user-role";
import type { UserSession } from "@/modules/auth/domain/auth.types";

export interface AuthorizationState {
	session: UserSession | null;
	role: UserRole | undefined;
	isAuthenticated: boolean;
	hasRole: (targetRole: UserRole) => boolean;
	hasAnyRole: (roles: UserRole[]) => boolean;
}

/**
 * Hook de autorización para comprobación declarativa de roles en la UI.
 * Permite evaluar permisos y controlar visibilidad de elementos según la sesión activa.
 */
export function useAuthorization(): AuthorizationState {
	const { session, role, isAuthenticated } = useSession();

	const hasRole = useCallback(
		(targetRole: UserRole): boolean => {
			if (!isAuthenticated || !role) return false;
			return role === targetRole;
		},
		[isAuthenticated, role],
	);

	const hasAnyRole = useCallback(
		(roles: UserRole[]): boolean => {
			if (!isAuthenticated || !role) return false;
			return roles.includes(role);
		},
		[isAuthenticated, role],
	);

	return {
		session,
		role,
		isAuthenticated,
		hasRole,
		hasAnyRole,
	};
}
