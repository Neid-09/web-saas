import { httpClient, UnauthorizedError } from "@/shared/http";
import {
	clearSessionCookies,
	setSessionCookies,
} from "@/shared/utils/cookies";
import { AuthRepository } from "../domain/auth.repository";
import { UserSession } from "../domain/auth.types";
import { InvalidCredentialsError } from "../domain/auth.errors";
import { LoginCredentials, LoginResult } from "../application/auth.types";
import {
	mapLoginResponseToDomain,
	mapMeResponseToDomain,
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

			const result = mapLoginResponseToDomain(data, credentials.email);

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
		const { data } = await httpClient.get<Squad1MeResponse>("/auth/me");
		return mapMeResponseToDomain(data, data.tenantId, "");
	}

	/**
	 * Cierra la sesión activa y elimina las cookies de autenticación.
	 */
	async logout(): Promise<void> {
		await clearSessionCookies();
	}
}
