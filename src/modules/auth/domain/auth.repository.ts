import { UserSession } from './auth.types';

/**
 * PUERTO (Contrato abstracto de dominio) para las operaciones de autenticación.
 * Regla: TypeScript puro, sin dependencias de librerías ni de infraestructura.
 */
export interface AuthRepository {
  login(credentials: { email: string; password: string }): Promise<{
    tokens: { accessToken: string; refreshToken?: string };
    session: UserSession;
  }>;
  getCurrentUser(): Promise<UserSession>;
  logout(): Promise<void>;
}
