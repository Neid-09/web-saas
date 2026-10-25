import { UseFormRegister, FieldErrors } from "react-hook-form";
import { MapPin } from "lucide-react";
import { CreateTenantFormData } from "../../schemas/create-tenant.schema";

interface StepContactProps {
	register: UseFormRegister<CreateTenantFormData>;
	errors: FieldErrors<CreateTenantFormData>;
}

/**
 * Paso 2 del Wizard: Ubicación física principal y canales de contacto directo.
 */
export function StepContact({ register, errors }: StepContactProps) {
	return (
		<fieldset className="space-y-5 border-0 p-0 m-0">
			<legend className="sr-only">Ubicación y Contacto Directo</legend>

			<header className="border-b border-border-default pb-4">
				<h2
					id="wizard-step-heading"
					className="text-base sm:text-lg font-bold font-heading text-text-primary flex items-center gap-2"
				>
					<MapPin className="w-5 h-5 text-brand-primary" />
					Paso 2: Ubicación y Contacto Directo
				</h2>
				<p className="text-xs text-text-muted font-body mt-1">
					Sede administrativa principal y canales oficiales de comunicación.
				</p>
			</header>

			<div className="space-y-4">
				<div>
					<label
						htmlFor="address"
						className="block text-xs font-semibold font-heading text-text-primary mb-1.5"
					>
						Dirección Física Principal *
					</label>
					<input
						id="address"
						type="text"
						placeholder="Ej: Carrera 9 # 12-45 Barrio Centro"
						aria-invalid={errors.address ? "true" : "false"}
						aria-describedby={errors.address ? "address-error" : undefined}
						{...register("address")}
						className={`w-full px-3.5 py-2.5 rounded-lg border font-body text-sm text-text-primary bg-surface transition-colors focus-visible:outline-2 ${
							errors.address
								? "border-danger focus-visible:outline-danger"
								: "border-border-default focus-visible:outline-brand-primary"
						}`}
					/>
					{errors.address && (
						<p
							id="address-error"
							className="text-2xs text-danger font-medium font-body mt-1"
						>
							{errors.address.message}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="phone"
							className="block text-xs font-semibold font-heading text-text-primary mb-1.5"
						>
							Teléfono de Contacto (10 dígitos) *
						</label>
						<input
							id="phone"
							type="tel"
							placeholder="Ej: 3101234567"
							maxLength={10}
							aria-invalid={errors.phone ? "true" : "false"}
							aria-describedby={errors.phone ? "phone-error" : undefined}
							{...register("phone")}
							className={`w-full px-3.5 py-2.5 rounded-lg border font-mono tabular-nums text-sm text-text-primary bg-surface transition-colors focus-visible:outline-2 ${
								errors.phone
									? "border-danger focus-visible:outline-danger"
									: "border-border-default focus-visible:outline-brand-primary"
							}`}
						/>
						{errors.phone && (
							<p
								id="phone-error"
								className="text-2xs text-danger font-medium font-body mt-1"
							>
								{errors.phone.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-xs font-semibold font-heading text-text-primary mb-1.5"
						>
							Correo Electrónico Corporativo *
						</label>
						<input
							id="email"
							type="email"
							placeholder="Ej: contacto@empresa.com"
							aria-invalid={errors.email ? "true" : "false"}
							aria-describedby={errors.email ? "email-error" : undefined}
							{...register("email")}
							className={`w-full px-3.5 py-2.5 rounded-lg border font-body text-sm text-text-primary bg-surface transition-colors focus-visible:outline-2 ${
								errors.email
									? "border-danger focus-visible:outline-danger"
									: "border-border-default focus-visible:outline-brand-primary"
							}`}
						/>
						{errors.email && (
							<p
								id="email-error"
								className="text-2xs text-danger font-medium font-body mt-1"
							>
								{errors.email.message}
							</p>
						)}
					</div>
				</div>
			</div>
		</fieldset>
	);
}
