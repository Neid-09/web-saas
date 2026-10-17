import "server-only";
import { cookies } from "next/headers";

import {
	AUTH_TOKEN_KEY,
	REFRESH_TOKEN_KEY,
	USER_ROLE_KEY,
	TENANT_ID_KEY,
} from "../config/cookie-keys";

export { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ROLE_KEY, TENANT_ID_KEY };

const base = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	path: "/",
};

/**
 * Obtiene el Bearer token de autenticación desde las cookies del servidor.
 */
export async function getAuthToken(): Promise<string | null> {
	return (await cookies()).get(AUTH_TOKEN_KEY)?.value ?? null;
}

/**
 * Establece las cookies seguras de sesión HttpOnly.
 * Solo debe ser invocado desde Server Actions o Route Handlers.
 */
export async function setSessionCookies(t: {
	access: string;
	refresh?: string;
	maxAge?: number;
	role?: string;
	tenantId?: string;
}): Promise<void> {
	const store = await cookies();
	store.set(AUTH_TOKEN_KEY, t.access, {
		...base,
		maxAge: t.maxAge ?? 60 * 60 * 8, // 8 horas por defecto (alineado con la sesión de E1 en Redis)
	});
	if (t.refresh) {
		store.set(REFRESH_TOKEN_KEY, t.refresh, {
			...base,
			maxAge: 60 * 60 * 24 * 7, // 7 días para el refresh token
		});
	}
	if (t.role) {
		store.set(USER_ROLE_KEY, t.role, {
			...base,
			maxAge: t.maxAge ?? 60 * 60 * 24 * 7,
		});
	}
	if (t.tenantId) {
		store.set(TENANT_ID_KEY, t.tenantId, {
			...base,
			maxAge: t.maxAge ?? 60 * 60 * 24 * 7,
		});
	}
}

/**
 * Elimina todas las cookies de sesión activa.
 */
export async function clearSessionCookies(): Promise<void> {
	const store = await cookies();
	[AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ROLE_KEY, TENANT_ID_KEY].forEach(
		(k) => store.delete(k),
	);
}
