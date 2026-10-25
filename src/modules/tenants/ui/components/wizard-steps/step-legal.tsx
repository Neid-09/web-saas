import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FileText } from "lucide-react";
import { CreateTenantFormData } from "../../schemas/create-tenant.schema";

interface StepLegalProps {
	register: UseFormRegister<CreateTenantFormData>;
	errors: FieldErrors<CreateTenantFormData>;
}

/**
 * Paso 1 del Wizard: Identificación legal, tributaria y denominación corporativa.
 */
export function StepLegal({ register, errors }: StepLegalProps) {
	return (
		<fieldset className="space-y-5 border-0 p-0 m-0">
			<legend className="sr-only">Identificación Legal y Comercial</legend>

			<header className="border-b border-border-default pb-4">
				<h2
					id="wizard-step-heading"
					className="text-base sm:text-lg font-bold font-heading text-text-primary flex items-center gap-2"
				>
					<FileText className="w-5 h-5 text-brand-primary" />
					Paso 1: Identificación Legal y Comercial
				</h2>
				<p className="text-xs text-text-muted font-body mt-1">
					Datos tributarios y denominación legal registrada en cámara de comercio.
				</p>
			</header>

			<div className="space-y-4">
				<div>
					<label
						htmlFor="nitRut"
						className="block text-xs font-semibold font-heading text-text-primary mb-1.5"
					>
						NIT o RUT con Dígito de Verificación *
					</label>
					<input
						id="nitRut"
						type="text"
						placeholder="Ej: 900123456-1"
						aria-invalid={errors.nitRut ? "true" : "false"}
						aria-describedby={errors.nitRut ? "nitRut-error" : undefined}
						{...register("nitRut")}
						className={`w-full px-3.5 py-2.5 rounded-lg border font-mono tabular-nums text-sm text-text-primary bg-surface transition-colors focus-visible:outline-2 ${
							errors.nitRut
								? "border-danger focus-visible:outline-danger"
								: "border-border-default focus-visible:outline-brand-primary"
						}`}
					/>
					{errors.nitRut && (
						<p
							id="nitRut-error"
							className="text-2xs text-danger font-medium font-body mt-1"
						>
							{errors.nitRut.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="businessName"
						className="block text-xs font-semibold font-heading text-text-primary mb-1.5"
					>
						Razón Social (Nombre Legal) *
					</label>
					<input
						id="businessName"
						type="text"
						placeholder="Ej: Inversiones y Comercio del Putumayo S.A.S."
						aria-invalid={errors.businessName ? "true" : "false"}
						aria-describedby={
							errors.businessName ? "businessName-error" : undefined
						}
						{...register("businessName")}
						className={`w-full px-3.5 py-2.5 rounded-lg border font-body text-sm text-text-primary bg-surface transition-colors focus-visible:outline-2 ${
							errors.businessName
								? "border-danger focus-visible:outline-danger"
								: "border-border-default focus-visible:outline-brand-primary"
						}`}
					/>
					{errors.businessName && (
						<p
							id="businessName-error"
							className="text-2xs text-danger font-medium font-body mt-1"
						>
							{errors.businessName.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="tradeName"
						className="block text-xs font-semibold font-heading text-text-primary mb-1.5"
					>
						Nombre Comercial / Marca Visible (Opcional)
					</label>
					<input
						id="tradeName"
						type="text"
						placeholder="Ej: Supertiendas Putumayo"
						{...register("tradeName")}
						className="w-full px-3.5 py-2.5 rounded-lg border border-border-default font-body text-sm text-text-primary bg-surface transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary"
					/>
					<p className="text-2xs text-text-muted font-body mt-1">
						Nombre con el que los clientes finales identificarán sus recibos y puntos de venta.
					</p>
				</div>
			</div>
		</fieldset>
	);
}
