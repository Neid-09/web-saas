import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

interface WizardNavigationProps {
	currentStep: number;
	totalSteps: number;
	isSubmitting: boolean;
	onPrev: () => void;
	onNext: () => void;
}

/**
 * Barra inferior de navegación entre pasos del Wizard.
 */
export function WizardNavigation({
	currentStep,
	totalSteps,
	isSubmitting,
	onPrev,
	onNext,
}: WizardNavigationProps) {
	return (
		<footer className="flex items-center justify-between pt-4 border-t border-border-default">
			<button
				type="button"
				disabled={currentStep === 1 || isSubmitting}
				onClick={onPrev}
				className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-default text-xs sm:text-sm font-semibold font-heading transition-colors ${
					currentStep === 1 || isSubmitting
						? "opacity-40 cursor-not-allowed bg-subtle text-text-muted"
						: "bg-surface text-text-secondary hover:bg-subtle cursor-pointer"
				}`}
			>
				<ArrowLeft className="w-4 h-4" />
				Anterior
			</button>

			<div className="flex items-center gap-3">
				<span className="text-xs text-text-muted font-mono tabular-nums hidden sm:inline">
					Paso {currentStep} de {totalSteps}
				</span>

				{currentStep < totalSteps ? (
					<button
						type="button"
						disabled={isSubmitting}
						onClick={onNext}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white text-xs sm:text-sm font-semibold font-heading hover:bg-brand-primary/90 transition-colors shadow-xs shadow-brand-primary/20 cursor-pointer"
					>
						Continuar
						<ArrowRight className="w-4 h-4" />
					</button>
				) : (
					<button
						type="submit"
						disabled={isSubmitting}
						className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold font-heading transition-all ${
							isSubmitting
								? "bg-brand-primary/70 text-white cursor-wait"
								: "bg-checkout hover:bg-checkout/90 text-white shadow-md shadow-checkout/20 cursor-pointer"
						}`}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Registrando Empresa...
							</>
						) : (
							<>
								<CheckCircle2 className="w-4 h-4" />
								Confirmar y Crear Empresa
							</>
						)}
					</button>
				)}
			</div>
		</footer>
	);
}
