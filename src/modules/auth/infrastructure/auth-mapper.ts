import { UserRole, UserSession } from "../domain/auth.types";
import { LoginResult } from "../application/auth.types";

export interface Squad1LoginResponse {
	accessToken: string;
	refreshToken?: string;
	user: {
		id: string;
		tenantId: string;
		branchId: string;
		role: string;
	};
}

export interface Squad1MeResponse {
	fullName: string;
	role: string;
	tenantName: string;
	branchName: string;
	tenantId: string;
	branchId: string;
}

/**
 * Transforma la respuesta del endpoint POST /api/v1/auth/login en la entidad de dominio LoginResult.
 */
export function mapLoginResponseToDomain(
	response: Squad1LoginResponse,
	email: string,
): LoginResult {
	return {
		tokens: {
			accessToken: response.accessToken,
			refreshToken: response.refreshToken,
		},
		session: {
			id: response.user.id,
			email,
			role: response.user.role as UserRole,
			tenantId: response.user.tenantId,
			branchId: response.user.branchId,
		},
	};
}

/**
 * Transforma la respuesta del endpoint GET /api/v1/auth/me en la entidad de dominio UserSession.
 */
export function mapMeResponseToDomain(
	response: Squad1MeResponse,
	userId: string,
	email: string,
): UserSession {
	return {
		id: userId,
		email,
		fullName: response.fullName,
		role: response.role as UserRole,
		tenantId: response.tenantId,
		branchId: response.branchId,
		tenantName: response.tenantName,
		branchName: response.branchName,
	};
}
