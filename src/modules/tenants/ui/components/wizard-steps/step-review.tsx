import { CheckCircle2, Building2 } from "lucide-react";
import { CreateTenantFormData } from "../../schemas/create-tenant.schema";

interface StepReviewProps {
	values: CreateTenantFormData;
}

/**
 * Paso 4 del Wizard: Ficha resumen de confirmación previa antes del envío a la API.
 */
export function StepReview({ values }: StepReviewProps) {
	return (
		<fieldset className="space-y-5 border-0 p-0 m-0">
			<legend className="sr-only">Revisión y Confirmación Final</legend>

			<header className="border-b border-border-default pb-4">
				<h2
					id="wizard-step-heading"
					className="text-base sm:text-lg font-bold font-heading text-text-primary flex items-center gap-2"
				>
					<CheckCircle2 className="w-5 h-5 text-checkout" />
					Paso 4: Revisión de la Ficha Corporativa
				</h2>
				<p className="text-xs text-text-muted font-body mt-1">
					Verifica la información registrada antes de enviar el alta al sistema.
				</p>
			</header>

			{/* Tarjeta de Resumen Previo */}
			<div className="bg-subtle border border-border-default rounded-xl p-5 space-y-4">
				<div className="flex items-center justify-between border-b border-border-default pb-3">
					<div>
						<span className="text-2xs font-semibold uppercase text-text-muted font-heading tracking-wider">
							Razón Social
						</span>
						<h3 className="text-base font-bold font-heading text-text-primary mt-0.5">
							{values.businessName || "—"}
						</h3>
					</div>
					<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-heading">
						Alta Nueva
					</span>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
					<div>
						<span className="text-text-muted font-body">NIT / RUT:</span>
						<p className="font-mono tabular-nums font-semibold text-text-primary mt-0.5">
							{values.nitRut || "—"}
						</p>
					</div>

					<div>
						<span className="text-text-muted font-body">Nombre Comercial:</span>
						<p className="font-body font-semibold text-text-primary mt-0.5">
							{values.tradeName || values.businessName || "—"}
						</p>
					</div>

					<div>
						<span className="text-text-muted font-body">Dirección:</span>
						<p className="font-body text-text-primary mt-0.5">
							{values.address || "—"}
						</p>
					</div>

					<div>
						<span className="text-text-muted font-body">Teléfono:</span>
						<p className="font-mono tabular-nums font-semibold text-text-primary mt-0.5">
							{values.phone || "—"}
						</p>
					</div>

					<div>
						<span className="text-text-muted font-body">Correo Corporativo:</span>
						<p className="font-body text-text-secondary mt-0.5">
							{values.email || "—"}
						</p>
					</div>

					<div>
						<span className="text-text-muted font-body">Régimen Fiscal:</span>
						<p className="font-body font-semibold text-text-primary mt-0.5">
							{values.taxRegime || "RESPONSABLE_IVA"}
						</p>
					</div>
				</div>
			</div>

			<div className="p-3.5 bg-brand-primary/5 border border-brand-primary/20 rounded-xl flex items-start gap-3">
				<Building2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
				<p className="text-xs text-text-secondary font-body leading-relaxed">
					Al confirmar el registro, la empresa quedará dada de alta de forma inmutable en el backend y se habilitará la opción para designar a su primer <strong>Administrador General</strong>.
				</p>
			</div>
		</fieldset>
	);
}
