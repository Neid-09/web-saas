import { AuthRepository } from '../domain/auth.repository';
import { UserSession } from '../domain/auth.types';
import { InvalidCredentialsError } from '../domain/auth.errors';
import { LoginCredentials, LoginResult } from '../application/auth.types';

/**
 * Adaptador en memoria (Mock) de `AuthRepository` para pruebas unitarias
 * y contingencia sin conexión a red.
 */
export class InMemoryAuthRepository implements AuthRepository {
  private currentUser: UserSession | null = null;

  constructor(initialUser?: UserSession) {
    if (initialUser) this.currentUser = initialUser;
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    if (credentials.password === 'invalid' || !credentials.password) {
      throw new InvalidCredentialsError('Credenciales inválidas en entorno mock.');
    }
    const session: UserSession = {
      id: 'mock-user-id-001',
      email: credentials.email,
      fullName: 'Usuario Mock de Pruebas',
      role: 'ADMIN',
      tenantId: 'mock-tenant-001',
      branchId: 'mock-branch-001',
      tenantName: 'Empresa Mock UniPutumayo',
      branchName: 'Sede Principal Mocoa',
    };

    this.currentUser = session;

    return {
      tokens: {
        accessToken: 'mock-jwt-access-token',
        refreshToken: 'mock-jwt-refresh-token',
      },
      session,
    };
  }

  async getCurrentUser(): Promise<UserSession> {
    if (!this.currentUser) {
      throw new Error('No hay sesión activa en el repositorio mock.');
    }
    return this.currentUser;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }
}
