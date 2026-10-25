"use client";

import { Check } from "lucide-react";

export interface WizardStepItem {
	step: number;
	title: string;
	description: string;
}

export const WIZARD_STEPS: readonly WizardStepItem[] = [
	{
		step: 1,
		title: "Datos Legales",
		description: "NIT y Razón Social",
	},
	{
		step: 2,
		title: "Contacto",
		description: "Dirección y Teléfono",
	},
	{
		step: 3,
		title: "Fiscal & Moneda",
		description: "Régimen DIAN",
	},
	{
		step: 4,
		title: "Revisión",
		description: "Confirmación final",
	},
];

interface WizardStepperProps {
	currentStep: number;
	onStepClick?: (step: number) => void;
}

/**
 * Barra de progreso horizontal accesible y semántica para el Wizard de Creación.
 */
export function WizardStepper({
	currentStep,
	onStepClick,
}: WizardStepperProps) {
	return (
		<nav
			aria-label="Progreso del alta de empresa"
			className="w-full bg-surface border border-border-default rounded-2xl p-4 sm:p-6 shadow-xs"
		>
			<ol role="list" className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{WIZARD_STEPS.map((item) => {
					const isCompleted = currentStep > item.step;
					const isCurrent = currentStep === item.step;
					const isClickable = isCompleted && onStepClick;

					return (
						<li
							key={item.step}
							aria-current={isCurrent ? "step" : undefined}
							className="flex items-center gap-3"
						>
							<button
								type="button"
								disabled={!isClickable}
								onClick={() => isClickable && onStepClick(item.step)}
								className={`flex items-center gap-3 text-left w-full rounded-lg transition-colors p-1.5 ${
									isClickable
										? "cursor-pointer hover:bg-subtle focus-visible:outline-2 focus-visible:outline-brand-primary"
										: "cursor-default"
								}`}
								title={
									isClickable ? `Volver al paso ${item.step}: ${item.title}` : item.title
								}
							>
								{/* Indicador Numérico o Checkmark */}
								<div
									className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-heading font-bold text-xs transition-all ${
										isCompleted
											? "bg-checkout text-white shadow-xs"
											: isCurrent
												? "bg-brand-primary text-white shadow-md shadow-brand-primary/25 ring-2 ring-brand-primary/20"
												: "bg-subtle text-text-muted border border-border-default"
									}`}
								>
									{isCompleted ? (
										<Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
									) : (
										<span className="font-mono tabular-nums">{item.step}</span>
									)}
								</div>

								{/* Textos descriptivos */}
								<div className="min-w-0">
									<p
										className={`text-xs font-bold font-heading truncate ${
											isCurrent
												? "text-brand-primary"
												: isCompleted
													? "text-text-primary"
													: "text-text-muted"
										}`}
									>
										{item.title}
									</p>
									<p className="text-2xs text-text-muted font-body truncate hidden sm:block">
										{item.description}
									</p>
								</div>
							</button>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
