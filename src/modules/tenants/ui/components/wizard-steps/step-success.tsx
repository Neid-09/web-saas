import Link from "next/link";
import { ArrowLeft, Building2, CheckCircle2 } from "lucide-react";
import { Tenant } from "../../../domain/tenant.entity";
import { TenantStatusBadge } from "../tenant-status-badge";

interface StepSuccessProps {
	tenant: Tenant;
}

/**
 * Pantalla de confirmación y éxito tras dar de alta una empresa en el sistema.
 */
export function StepSuccess({ tenant }: StepSuccessProps) {
	return (
		<section
			aria-labelledby="success-title"
			className="bg-surface border border-border-default rounded-2xl p-6 sm:p-10 shadow-xs text-center max-w-2xl mx-auto space-y-6"
		>
			<div className="w-16 h-16 rounded-2xl bg-checkout/10 text-checkout flex items-center justify-center mx-auto shadow-xs">
				<CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
			</div>

			<div className="space-y-2">
				<h2
					id="success-title"
					className="text-xl sm:text-2xl font-bold font-heading text-text-primary"
				>
					¡Empresa Registrada Exitosamente!
				</h2>
				<p className="text-sm text-text-muted font-body max-w-md mx-auto">
					La organización ha sido creada en la plataforma SaaS y se encuentra lista
					para la asignación de su primer Administrador General.
				</p>
			</div>

			{/* Ficha resumen de la empresa creada */}
			<div className="bg-subtle border border-border-default rounded-xl p-5 text-left space-y-3">
				<div className="flex items-center justify-between border-b border-border-default pb-3">
					<div>
						<p className="text-xs text-text-muted font-body">Razón Social</p>
						<h3 className="text-base font-bold font-heading text-text-primary">
							{tenant.businessName}
						</h3>
					</div>
					<TenantStatusBadge isActive={tenant.isActive} />
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
					<div>
						<span className="text-text-muted font-body">NIT / RUT:</span>
						<p className="font-mono tabular-nums font-semibold text-text-primary mt-0.5">
							{tenant.nitRut}
						</p>
					</div>
					<div>
						<span className="text-text-muted font-body">Nombre Comercial:</span>
						<p className="font-body font-semibold text-text-primary mt-0.5">
							{tenant.displayName}
						</p>
					</div>
					<div>
						<span className="text-text-muted font-body">Correo Corporativo:</span>
						<p className="font-body text-text-secondary mt-0.5">
							{tenant.email}
						</p>
					</div>
					<div>
						<span className="text-text-muted font-body">Identificador (UUID):</span>
						<p className="font-mono tabular-nums text-2xs text-text-muted mt-0.5 truncate">
							{tenant.id}
						</p>
					</div>
				</div>
			</div>

			{/* Acciones de continuidad */}
			<div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
				<Link
					href="/dashboard/tenants"
					className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border-default bg-surface text-text-secondary text-sm font-semibold font-heading hover:bg-subtle transition-colors cursor-pointer"
				>
					<ArrowLeft className="w-4 h-4" />
					Volver al Directorio
				</Link>

				<Link
					href="/dashboard/tenants"
					className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold font-heading hover:bg-brand-primary/90 transition-colors shadow-xs shadow-brand-primary/20 cursor-pointer"
				>
					<Building2 className="w-4 h-4" />
					Gestionar en Directorio
				</Link>
			</div>
		</section>
	);
}
