"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export interface DashboardErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
	const handleReset = () => {
		reset();
	};

	return (
		<div
			role="alert"
			className="p-6 sm:p-8 flex items-center justify-center min-h-[calc(100vh-10rem)]"
		>
			<div className="max-w-md w-full bg-surface border border-border-default rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xs">
				{/* Icono de advertencia */}
				<div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto">
					<AlertTriangle className="w-6 h-6" aria-hidden="true" />
				</div>

				{/* Textos explicativos */}
				<div className="space-y-2">
					<h2 className="text-lg font-bold font-heading text-text-primary">
						Inconveniente al cargar la sección
					</h2>
					<p className="text-sm text-text-muted font-body">
						No fue posible procesar la vista solicitada. Puedes reintentar la
						operación o volver al panel principal.
					</p>
				</div>

				{error.message && (
					<div className="p-3 bg-subtle border border-border-default rounded-xl text-left overflow-x-auto">
						<p className="text-2xs font-mono text-text-secondary wrap-break-word">
							{error.message}
						</p>
					</div>
				)}

				{/* Botones de acción accesibles */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
					<button
						type="button"
						onClick={handleReset}
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-surface font-semibold text-sm hover:bg-brand-primary-dark transition-colors focus:outline-hidden focus:ring-2 focus:ring-brand-primary cursor-pointer"
					>
						<RotateCcw className="w-4 h-4" aria-hidden="true" />
						<span>Reintentar</span>
					</button>

					<Link
						href="/dashboard"
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-subtle text-text-secondary hover:text-text-primary hover:bg-border-default font-semibold text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-brand-primary text-center"
					>
						<Home className="w-4 h-4" aria-hidden="true" />
						<span>Inicio</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
