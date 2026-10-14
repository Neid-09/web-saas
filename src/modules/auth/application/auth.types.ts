import { UserSession } from '../domain/auth.types';

/**
 * Credenciales de acceso provistas para la autenticación.
 * Tipo plano de la capa de aplicación (sin dependencias de Zod ni frameworks).
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Tokens de autenticación emitidos por el servidor de identidad.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

/**
 * Resultado de una operación exitosa de inicio de sesión.
 */
export interface LoginResult {
  tokens: AuthTokens;
  session: UserSession;
}
