"use client";

import React from "react";
import { LoginBrandHeader } from "./login-brand-header";
import { LoginForm } from "./login-form";
import { LoginHeroCard } from "./login-hero-card";

/**
 * Vista orquestadora principal para la pantalla de inicio de sesión.
 * Pertenece a la capa `ui/components/`.
 */
export function LoginView() {
	return (
		<div className="min-h-screen w-full flex flex-col lg:flex-row bg-canvas">
			{/* ── COLUMNA IZQUIERDA: FORMULARIO DE ACCESO ── */}
			<div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-8 sm:p-12 lg:p-14 xl:p-16">
				<LoginBrandHeader />

				<React.Suspense
					fallback={
						<div className="w-full max-w-sm mx-auto my-auto py-8 animate-pulse space-y-4">
							<div className="h-4 w-28 bg-surface-secondary rounded" />
							<div className="h-8 w-44 bg-surface-secondary rounded" />
							<div className="h-4 w-56 bg-surface-secondary rounded mb-6" />
							<div className="h-12 w-full bg-surface-secondary rounded-xl" />
							<div className="h-12 w-full bg-surface-secondary rounded-xl" />
							<div className="h-12 w-full bg-surface-secondary rounded-xl" />
						</div>
					}
				>
					<LoginForm />
				</React.Suspense>

				{/* Pie de Página Inferior Izquierdo */}
				<footer className="flex items-center gap-2 pt-4">
					<span className="w-5 h-0.5 bg-brand-primary-dark/40 rounded-full" />
					<span className="text-xs text-text-muted font-body">
						Tecnología que conecta tu comercio.
					</span>
				</footer>
			</div>

			{/* ── COLUMNA DERECHA: TARJETA HERO ILUSTRADA ── */}
			<LoginHeroCard />
		</div>
	);
}
