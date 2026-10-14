'use client';

import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useLogin } from '../hooks/use-login';
import { Toast } from '@/shared/ui/toast';

export function LoginForm() {
  const {
    form: {
      register,
      formState: { errors },
    },
    isLoading,
    loginError,
    loginSuccess,
    showPassword,
    toggleShowPassword,
    dismissError,
    onSubmit,
  } = useLogin();

  return (
    <>
      {loginError && (
        <Toast
          type="error"
          message={loginError}
          onClose={dismissError}
        />
      )}

      {loginSuccess && (
        <Toast
          type="success"
          message="Credenciales verificadas. Redirigiendo a tu espacio de trabajo..."
          onClose={() => {}}
        />
      )}

      <div className="w-full sm:max-w-md mx-auto rounded-card-sm sm:rounded-card bg-surface p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-border-default/70 relative">
        {/* ── ENCABEZADO DE LA TARJETA ── */}
        <div className="mb-7">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-heading tracking-tight">
            Iniciar Sesión
          </h2>
          <p className="text-xs sm:text-sm text-text-muted font-body mt-1.5">
            Plataforma Comercial &amp; Punto de Venta
          </p>
        </div>

        {/* ── FORMULARIO DE ACCESO (POSICIÓN ESTABLE Y FIJA) ── */}
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {/* Campo: Correo Electrónico */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-text-secondary mb-1.5"
            >
              Correo Electrónico
            </label>
            <div
              className={`relative rounded-xl border bg-surface transition-all shadow-2xs focus-within:ring-2 ${
                errors.email
                  ? 'border-danger focus-within:border-danger focus-within:ring-danger/20'
                  : 'border-border-default hover:border-border-hover focus-within:border-brand-primary focus-within:ring-brand-primary/20'
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="suadmin@comercio.co"
                disabled={isLoading || loginSuccess}
                {...register('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted bg-transparent outline-none rounded-xl disabled:opacity-60"
              />
            </div>
            {errors.email?.message && (
              <p id="email-error" className="text-2xs text-danger mt-1.5 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo: Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-text-secondary mb-1.5"
            >
              Contraseña
            </label>
            <div
              className={`relative rounded-xl border bg-surface transition-all shadow-2xs focus-within:ring-2 ${
                errors.password
                  ? 'border-danger focus-within:border-danger focus-within:ring-danger/20'
                  : 'border-border-default hover:border-border-hover focus-within:border-brand-primary focus-within:ring-brand-primary/20'
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••••••"
                disabled={isLoading || loginSuccess}
                {...register('password')}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className="w-full pl-10 pr-11 py-3 text-sm text-text-primary placeholder:text-text-muted bg-transparent outline-none rounded-xl disabled:opacity-60"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                disabled={isLoading || loginSuccess}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-secondary focus:outline-none transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password?.message && (
              <p id="password-error" className="text-2xs text-danger mt-1.5 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botón Principal: Ingresar */}
          <button
            type="submit"
            disabled={isLoading || loginSuccess}
            className="w-full mt-6 py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-dark active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm shadow-brand-primary/25 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Ingresar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
