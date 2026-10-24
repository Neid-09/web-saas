"use client";

import { Building2, RefreshCw, AlertCircle, Mail, Phone } from "lucide-react";
import { useTenants } from "../hooks/use-tenants";
import { TenantStatusBadge } from "./tenant-status-badge";

const REGIME_LABELS: Record<string, string> = {
	REGIMEN_SIMPLE: "Régimen Simple",
	RESPONSABLE_IVA: "Responsable de IVA",
	NO_RESPONSABLE_IVA: "No Resp. IVA",
	GRAN_CONTRIBUYENTE: "Gran Contribuyente",
	REGIMEN_ESPECIAL: "Régimen Especial",
};

export function TenantListTable() {
	const { tenants, isLoading, isError, error, refetch, isFetching } =
		useTenants();

	if (isLoading) {
		return (
			<section
				aria-label="Cargando directorio de empresas"
				className="bg-surface border border-border-default rounded-2xl overflow-hidden shadow-xs"
			>
				<div className="p-4 sm:p-6 border-b border-border-default flex items-center justify-between">
					<div className="h-5 w-40 bg-subtle rounded-md animate-pulse" />
					<div className="h-8 w-24 bg-subtle rounded-md animate-pulse" />
				</div>
				<div className="p-4 space-y-3">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-14 bg-subtle/60 rounded-xl animate-pulse"
						/>
					))}
				</div>
			</section>
		);
	}

	if (isError) {
		return (
			<section
				aria-label="Error al cargar directorio"
				className="p-8 bg-surface border border-danger/20 rounded-2xl text-center space-y-4"
			>
				<div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto">
					<AlertCircle className="w-6 h-6" />
				</div>
				<div className="max-w-md mx-auto space-y-1.5">
					<h3 className="text-base font-semibold font-heading text-text-primary">
						No fue posible cargar el directorio de empresas
					</h3>
					<p className="text-sm text-text-muted font-body">
						{error || "Ocurrió un error al contactar al servidor backend."}
					</p>
				</div>
				<button
					type="button"
					onClick={() => refetch()}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold font-heading hover:bg-brand-primary/90 transition-colors"
				>
					<RefreshCw className="w-4 h-4" />
					Reintentar
				</button>
			</section>
		);
	}

	return (
		<section
			aria-label="Directorio general de empresas"
			className="bg-surface border border-border-default rounded-2xl overflow-hidden shadow-xs"
		>
			<header className="p-4 sm:p-6 border-b border-border-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div>
					<h2 className="text-base sm:text-lg font-bold font-heading text-text-primary">
						Empresas Registradas
					</h2>
					<p className="text-xs sm:text-sm text-text-muted font-body mt-0.5">
						Total de <span className="font-mono tabular-nums font-semibold text-text-primary">{tenants.length}</span> {tenants.length === 1 ? "empresa registrada" : "empresas registradas"} en la plataforma
					</p>
				</div>

				<button
					type="button"
					onClick={() => refetch()}
					disabled={isFetching}
					className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default hover:bg-subtle text-xs font-semibold font-heading text-text-secondary transition-colors self-start sm:self-auto disabled:opacity-60"
					title="Actualizar listado"
				>
					<RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
					Actualizar
				</button>
			</header>

			{tenants.length === 0 ? (
				<div className="p-12 text-center space-y-3">
					<div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto">
						<Building2 className="w-6 h-6" />
					</div>
					<h3 className="text-base font-semibold font-heading text-text-primary">
						Sin empresas registradas
					</h3>
					<p className="text-sm text-text-muted font-body max-w-sm mx-auto">
						Actualmente no hay empresas dadas de alta en el sistema. Utilice el botón superior para crear la primera organización.
					</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<caption className="sr-only">
							Listado de empresas y organizaciones cliente en el SaaS
						</caption>
						<thead>
							<tr className="border-b border-border-default bg-subtle/50 text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
								<th scope="col" className="py-3.5 px-4 sm:px-6">
									Empresa / Razón Social
								</th>
								<th scope="col" className="py-3.5 px-4">
									NIT / RUT
								</th>
								<th scope="col" className="py-3.5 px-4">
									Contacto
								</th>
								<th scope="col" className="py-3.5 px-4 hidden md:table-cell">
									Régimen
								</th>
								<th scope="col" className="py-3.5 px-4">
									Estado
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border-default font-body text-sm">
							{tenants.map((tenant) => (
								<tr
									key={tenant.id}
									className="hover:bg-subtle/30 transition-colors"
								>
									<td className="py-4 px-4 sm:px-6">
										<div className="flex items-center gap-3">
											<div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
												<Building2 className="w-4 h-4" />
											</div>
											<div>
												<p className="font-semibold text-text-primary font-heading">
													{tenant.tradeName || tenant.businessName}
												</p>
												<p className="text-xs text-text-muted">
													{tenant.businessName}
												</p>
											</div>
										</div>
									</td>

									<td className="py-4 px-4 font-mono tabular-nums text-text-primary font-medium text-xs sm:text-sm">
										{tenant.nitRut}
									</td>

									<td className="py-4 px-4 space-y-1">
										<div className="flex items-center gap-1.5 text-xs text-text-secondary">
											<Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
											<span className="truncate max-w-[180px]">{tenant.email}</span>
										</div>
										{tenant.phone && (
											<div className="flex items-center gap-1.5 text-xs text-text-muted font-mono tabular-nums">
												<Phone className="w-3.5 h-3.5 shrink-0" />
												<span>{tenant.phone}</span>
											</div>
										)}
									</td>

									<td className="py-4 px-4 text-xs text-text-secondary hidden md:table-cell">
										{tenant.taxRegime
											? REGIME_LABELS[tenant.taxRegime] || tenant.taxRegime
											: "No especificado"}
									</td>

									<td className="py-4 px-4">
										<TenantStatusBadge isActive={tenant.isActive} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
