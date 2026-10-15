"use client";

import React from "react";
import { Smartphone } from "lucide-react";
import { LoginForm } from "./login-form";
import { LoginHeroCard } from "./login-hero-card";

/**
 * Vista orquestadora principal para la pantalla de inicio de sesión.
 * Pertenece a la capa `ui/components/`.
 * 
 * Ergonomía y distribución responsiva por dispositivo:
 * - Móviles / Tablets (< 1024px): Se oculta el panel lateral extenso ('hidden lg:flex')
 *   para evitar scroll vertical y permitir al usuario interactuar de inmediato con el formulario,
 *   acompañado de una cabecera institucional compacta.
 * - Pantallas Grandes / POS (≥ 1024px): Distribución dual simétrica (Hero lateral 58% + Login flotante 42%).
 * - Cero clases arbitrarias de píxeles fijos.
 */
export function LoginView() {
  return (
    <main className="min-h-screen w-full bg-canvas flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16 my-auto">
        {/* ── COLUMNA IZQUIERDA: TARJETA HERO INSTITUCIONAL (SOLO DESKTOP / POS ≥ 1024px) ── */}
        <div className="hidden lg:flex lg:w-7/12 self-stretch">
          <LoginHeroCard />
        </div>

        {/* ── COLUMNA DERECHA: FORMULARIO DE ACCESO Y CABECERA MÓVIL ── */}
        <div className="w-full sm:max-w-md lg:w-5/12 flex flex-col items-center justify-center py-2 sm:py-4">
          {/* Cabecera institucional compacta exclusiva para móviles (< 1024px) */}
          <header className="flex lg:hidden items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5 text-brand-secondary" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-base font-bold text-text-primary font-heading leading-tight tracking-tight">
                UniPutumayo
              </h1>
              <p className="text-2xs text-text-muted font-body">
                Sistema Comercial Universal
              </p>
            </div>
          </header>

          <React.Suspense
            fallback={
              <div className="w-full max-w-md mx-auto rounded-card-sm sm:rounded-card bg-surface p-8 sm:p-10 shadow-xl border border-border-default/60 animate-pulse space-y-4">
                <div className="h-6 w-32 bg-border-default rounded-md" />
                <div className="h-4 w-48 bg-border-default rounded-md mb-6" />
                <div className="h-12 w-full bg-border-default rounded-xl" />
                <div className="h-12 w-full bg-border-default rounded-xl" />
                <div className="h-12 w-full bg-brand-primary/20 rounded-xl" />
              </div>
            }
          >
            <LoginForm />
          </React.Suspense>

          {/* Pie de página institucional inferior */}
          <footer className="mt-6 lg:mt-8 text-center">
            <p className="text-2xs sm:text-xs text-text-muted font-body tracking-wide">
              UniPutumayo · Sistema Comercial Universal
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
