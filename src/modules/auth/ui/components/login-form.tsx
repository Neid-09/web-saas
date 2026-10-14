'use client';

import React from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useLogin } from '../hooks/use-login';

/**
 * Componente del formulario interactivo de inicio de sesión.
 * Consume el custom hook `useLogin` de la capa `ui/hooks/`.
 */
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
    onSubmit,
  } = useLogin();

  return (
    <main className="w-full max-w-sm mx-auto my-auto py-8">
      {/* Eyebrow Accent */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-0.5 bg-brand-secondary rounded-full" />
        <span className="text-2xs font-bold tracking-widest text-brand-primary uppercase">
          Acceso a la plataforma
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-heading tracking-tight">
        Iniciar Sesión
      </h2>
      <p className="text-xs sm:text-sm text-text-muted font-body mt-1 mb-8">
        Plataforma Comercial &amp; Punto de Venta
      </p>

      {/* Alerta de éxito */}
      {loginSuccess && (
        <div
          role="status"
          className="mb-6 p-3.5 rounded-xl bg-checkout/10 border border-checkout/20 text-checkout text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2"
        >
          <CheckCircle2 className="w-4 h-4 text-checkout shrink-0" />
          <span>
            <strong>Credenciales verificadas.</strong> Redirigiendo a tu espacio de trabajo...
          </span>
        </div>
      )}

      {/* Alerta de error de autenticación */}
      {loginError && (
        <div
          role="alert"
          className="mb-6 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2"
        >
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <span>{loginError}</span>
        </div>
      )}

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
            className={`relative rounded-xl border bg-surface transition-all shadow-xs focus-within:ring-2 ${
              errors.email
                ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20'
                : 'border-border-default focus-within:border-brand-primary focus-within:ring-brand-primary/20'
            }`}
          >
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              disabled={isLoading || loginSuccess}
              {...register('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="w-full pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted bg-transparent outline-none rounded-xl disabled:opacity-60"
            />
          </div>
          {errors.email?.message && (
            <p id="email-error" className="text-2xs text-destructive mt-1.5 font-medium">
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
            className={`relative rounded-xl border bg-surface transition-all shadow-xs focus-within:ring-2 ${
              errors.password
                ? 'border-destructive focus-within:border-destructive focus-within:ring-destructive/20'
                : 'border-border-default focus-within:border-brand-primary focus-within:ring-brand-primary/20'
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
            <p id="password-error" className="text-2xs text-destructive mt-1.5 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Botón Principal: Ingresar */}
        <button
          type="submit"
          disabled={isLoading || loginSuccess}
          className="w-full mt-6 py-3.5 px-6 rounded-xl bg-brand-primary hover:bg-brand-primary-dark active:scale-95 text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm shadow-brand-primary/25 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
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

      <p className="text-xs italic text-text-muted text-center mt-6">
        UniPutumayo · Sistema Comercial Universal
      </p>
    </main>
  );
}
