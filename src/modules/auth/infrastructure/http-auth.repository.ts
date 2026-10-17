import { httpClient, UnauthorizedError } from "@/shared/http";
import {
	clearSessionCookies,
	getAuthToken,
	setSessionCookies,
} from "@/shared/utils/cookies";
import { decodeJwtPayload } from "@/shared/utils/jwt";
import { AuthRepository } from "../domain/auth.repository";
import { UserSession } from "../domain/auth.types";
import { isUserRole } from "../domain/user-role";
import { InvalidCredentialsError } from "../domain/auth.errors";
import { LoginCredentials, LoginResult } from "../application/auth.types";
import {
	mapLoginResponseToDomain,
	Squad1LoginResponse,
	Squad1MeResponse,
} from "./auth-mapper";

/**
 * Adaptador de infraestructura HTTP que implementa el puerto `AuthRepository`
 * consumiendo la API real de Squad 1 (Core Architecture).
 * Exclusivo de ejecución de servidor.
 */
export class HttpAuthRepository implements AuthRepository {
	/**
	 * Autentica al usuario contra POST /api/v1/auth/login.
	 * Almacena tokens y cookies de sesión seguras HttpOnly en el servidor.
	 */
	async login(credentials: LoginCredentials): Promise<LoginResult> {
		try {
			const { data } = await httpClient.post<Squad1LoginResponse>(
				"/auth/login",
				{
					email: credentials.email,
					password: credentials.password,
				},
				{ skipAuth: true },
			);

			const result = mapLoginResponseToDomain(data);

			// Persistir tokens y metadatos de sesión en cookies seguras HttpOnly
			await setSessionCookies({
				access: result.tokens.accessToken,
				refresh: result.tokens.refreshToken,
				role: result.session.role,
				tenantId: result.session.tenantId,
			});

			return result;
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				throw new InvalidCredentialsError(
					"El correo o la contraseña no son correctos.",
				);
			}
			throw error;
		}
	}

	/**
	 * Consulta el perfil del usuario autenticado contra GET /api/v1/auth/me.
	 */
	async getCurrentUser(): Promise<UserSession> {
		const { data } = await httpClient.get<Squad1MeResponse>("/auth/me", {
			cache: "no-store",
		});

		const token = await getAuthToken();
		const claims = token ? decodeJwtPayload(token) : null;

		const id = claims?.sub;
		if (!id) throw new UnauthorizedError("Token sin identificador de usuario");
		if (!isUserRole(data.role)) throw new Error(`Rol desconocido: ${data.role}`);

		const tenantId = data.tenantId ?? claims?.tenantId;
		const branchId = data.branchId ?? claims?.branchId;

		if (!tenantId) throw new UnauthorizedError("Sesión sin tenant");

		if (data.tenantId && claims?.tenantId && data.tenantId !== claims.tenantId) {
			throw new UnauthorizedError("Inconsistencia de tenant entre token y API");
		}

		if (data.branchId && claims?.branchId && data.branchId !== claims.branchId) {
			throw new Error("Inconsistencia de sucursal entre token y API");
		}

		return {
			id,
			role: data.role,
			fullName: data.fullName,
			tenantName: data.tenantName,
			branchName: data.branchName,
			tenantId,
			branchId,
		};
	}

	/**
	 * Cierra la sesión activa y elimina las cookies de autenticación.
	 */
	async logout(): Promise<void> {
		await clearSessionCookies();
	}
}
