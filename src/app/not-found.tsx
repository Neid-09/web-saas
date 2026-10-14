import Link from 'next/link';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export const metadata = {
  title: '404 - No Encontrado | UniPutumayo',
  description: 'El recurso solicitado no fue encontrado',
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-canvas text-text-primary">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-surface border border-border-default shadow-xs text-center flex flex-col items-center">
        {/* Ícono de Estado */}
        <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6">
          <FileQuestion className="w-8 h-8" strokeWidth={2} />
        </div>

        {/* Etiqueta Técnica y Título */}
        <span className="text-2xs font-bold tracking-widest text-brand-primary uppercase font-mono mb-2">
          Error 404 · Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary tracking-tight">
          Recurso No Encontrado
        </h1>
        <p className="text-sm text-text-muted font-body mt-2 mb-8 leading-relaxed">
          La página, usuario o recurso que intentas consultar no existe, fue desactivado o la URL es incorrecta.
        </p>

        {/* Acciones de Navegación */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </Link>

          <Link
            href="/login"
            className="flex-1 py-3 px-4 rounded-xl border border-border-default hover:bg-subtle text-text-secondary text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-xs text-text-muted font-body">
        UniPutumayo · Sistema Comercial Universal
      </footer>
    </div>
  );
}
