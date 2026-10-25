import { UseFormRegister } from "react-hook-form";
import { BadgePercent, Globe, Coins } from "lucide-react";
import { CreateTenantFormData } from "../../schemas/create-tenant.schema";

interface StepFiscalProps {
	register: UseFormRegister<CreateTenantFormData>;
}

/**
 * Paso 3 del Wizard: Régimen tributario DIAN, país y divisa operativa.
 */
export function StepFiscal({ register }: StepFiscalProps) {
	return (
		<fieldset className="space-y-5 border-0 p-0 m-0">
			<legend className="sr-only">Parámetros Fiscales y Moneda</legend>

			<header className="border-b border-border-default pb-4">
				<h2
					id="wizard-step-heading"
					className="text-base sm:text-lg font-bold font-heading text-text-primary flex items-center gap-2"
				>
					<BadgePercent className="w-5 h-5 text-brand-primary" />
					Paso 3: Parámetros Fiscales y Comerciales
				</h2>
				<p className="text-xs text-text-muted font-body mt-1">
					Clasificación tributaria ante la DIAN y configuración de divisa operativa.
				</p>
			</header>

			<div className="space-y-4">
				<div>
					<label
						htmlFor="taxRegime"
						className="block text-xs font-semibold font-heading text-text-primary mb-1.5"
					>
						Régimen Tributario DIAN
					</label>
					<select
						id="taxRegime"
						{...register("taxRegime")}
						className="w-full px-3.5 py-2.5 rounded-lg border border-border-default font-body text-sm text-text-primary bg-surface transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary cursor-pointer"
					>
						<option value="RESPONSABLE_IVA">Responsable de IVA (Régimen Común)</option>
						<option value="REGIMEN_SIMPLE">Régimen Simple de Tributación (RST)</option>
						<option value="NO_RESPONSABLE_IVA">No Responsable de IVA (Régimen Simplificado)</option>
						<option value="GRAN_CONTRIBUYENTE">Gran Contribuyente</option>
						<option value="REGIMEN_ESPECIAL">Régimen Tributario Especial (ESAL)</option>
					</select>
					<p className="text-2xs text-text-muted font-body mt-1">
						Determina la liquidación impositiva por defecto en los comprobantes de venta del POS.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="countryCode"
							className="block text-xs font-semibold font-heading text-text-primary mb-1.5"
						>
							País de Operación
						</label>
						<div className="relative">
							<input
								id="countryCode"
								type="text"
								readOnly
								{...register("countryCode")}
								className="w-full px-3.5 py-2.5 rounded-lg border border-border-default font-mono tabular-nums text-sm text-text-muted bg-subtle cursor-not-allowed"
							/>
							<span className="absolute right-3 top-2.5 text-xs font-semibold text-text-muted font-heading flex items-center gap-1">
								<Globe className="w-3.5 h-3.5" />
								Colombia
							</span>
						</div>
					</div>

					<div>
						<label
							htmlFor="currencyCode"
							className="block text-xs font-semibold font-heading text-text-primary mb-1.5"
						>
							Moneda Principal
						</label>
						<div className="relative">
							<input
								id="currencyCode"
								type="text"
								readOnly
								{...register("currencyCode")}
								className="w-full px-3.5 py-2.5 rounded-lg border border-border-default font-mono tabular-nums text-sm text-text-muted bg-subtle cursor-not-allowed"
							/>
							<span className="absolute right-3 top-2.5 text-xs font-semibold text-text-muted font-heading flex items-center gap-1">
								<Coins className="w-3.5 h-3.5" />
								Peso (COP)
							</span>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
	);
}
