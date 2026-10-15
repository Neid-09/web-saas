import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export const metadata = {
  title: '403 - Acceso Denegado | UniPutumayo',
  description: 'Permisos insuficientes para acceder a este recurso',
};

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-canvas text-text-primary">
      <section
        aria-labelledby="forbidden-title"
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-surface border border-border-default shadow-xs text-center flex flex-col items-center"
      >
        {/* Ícono de Alerta de Permisos */}
        <div
          className="w-16 h-16 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mb-6"
          aria-hidden="true"
        >
          <ShieldAlert className="w-8 h-8" strokeWidth={2} />
        </div>

        {/* Etiqueta Técnica y Título */}
        <span className="text-2xs font-bold tracking-widest text-danger uppercase font-mono mb-2">
          Error 403 · Acceso Denegado
        </span>
        <h1
          id="forbidden-title"
          className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight"
        >
          Permisos Insuficientes
        </h1>
        <p className="text-sm text-text-muted font-body mt-2 mb-8 leading-relaxed">
          Tu rol de usuario actual no dispone de los privilegios necesarios para ver o modificar esta sección. Si requieres acceso, solicita autorización al <strong>Propietario (Owner)</strong> o Administrador de tu empresa.
        </p>

        {/* Acciones */}
        <nav
          aria-label="Acciones de navegación para acceso denegado"
          className="w-full flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Volver al Inicio</span>
          </Link>

          <Link
            href="/login"
            className="flex-1 py-3 px-4 rounded-xl border border-border-default hover:bg-subtle text-text-secondary text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Cambiar Cuenta</span>
          </Link>
        </nav>
      </section>

      <footer className="mt-8 text-xs text-text-muted font-body">
        UniPutumayo · Control de Acceso RBAC &amp; Multi-Tenant
      </footer>
    </main>
  );
}
