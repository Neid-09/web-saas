"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export interface TenantsErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function TenantsError({ error, reset }: TenantsErrorProps) {
	return (
		<main
			role="alert"
			className="p-6 sm:p-8 flex items-center justify-center min-h-[calc(100vh-10rem)]"
		>
			<div className="max-w-md w-full bg-surface border border-border-default rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xs">
				<div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto">
					<AlertTriangle className="w-6 h-6" aria-hidden="true" />
				</div>

				<div className="space-y-2">
					<h2 className="text-lg font-bold font-heading text-text-primary">
						Inconveniente al cargar empresas
					</h2>
					<p className="text-sm text-text-muted font-body">
						Ocurrió un error al consultar el directorio de tenants. Puedes reintentar la operación o volver al panel principal.
					</p>
				</div>

				{error.message && (
					<div className="p-3 bg-subtle border border-border-default rounded-xl text-left overflow-x-auto">
						<p className="text-xs font-mono text-text-secondary">
							{error.message}
						</p>
					</div>
				)}

				<div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
					<button
						type="button"
						onClick={() => reset()}
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold font-heading hover:bg-brand-primary/90 transition-colors"
					>
						<RotateCcw className="w-4 h-4" />
						Reintentar
					</button>

					<Link
						href="/dashboard"
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border-default text-text-primary text-sm font-medium font-body hover:bg-subtle transition-colors"
					>
						<Home className="w-4 h-4" />
						Ir al Panel
					</Link>
				</div>
			</div>
		</main>
	);
}
