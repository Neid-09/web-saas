"use client";

import { WizardStepper } from "./wizard-stepper";
import { StepLegal } from "./wizard-steps/step-legal";
import { StepContact } from "./wizard-steps/step-contact";
import { StepFiscal } from "./wizard-steps/step-fiscal";
import { StepReview } from "./wizard-steps/step-review";
import { StepSuccess } from "./wizard-steps/step-success";
import { WizardNavigation } from "./wizard-steps/wizard-navigation";
import { useCreateTenant } from "../hooks/use-create-tenant";
import { Toast } from "@/shared/ui/toast";

/**
 * Componente principal del Wizard Centrado para dar de alta una nueva empresa cliente.
 * Orquestador modular que delega en componentes de paso especializados con cero useEffect.
 */
export function CreateTenantWizard() {
	const {
		form,
		currentStep,
		totalSteps,
		nextStep,
		prevStep,
		goToStep,
		onSubmit,
		isSubmitting,
		isSuccess,
		error,
		createdTenant,
		resetMutation,
	} = useCreateTenant();

	const {
		register,
		watch,
		formState: { errors },
	} = form;

	const values = watch();

	// Pantalla de Éxito al completar el alta
	if (isSuccess && createdTenant) {
		return <StepSuccess tenant={createdTenant} />;
	}

	return (
		<div className="space-y-6 max-w-3xl mx-auto">
			{/* Toast flotante de error en caso de fallo */}
			{error && (
				<Toast
					type="error"
					title="Error al registrar empresa"
					message={error}
					onClose={resetMutation}
				/>
			)}

			{/* Barra de progreso horizontal */}
			<WizardStepper currentStep={currentStep} onStepClick={goToStep} />

			{/* Contenedor del Formulario */}
			<section
				aria-labelledby="wizard-step-heading"
				className="bg-surface border border-border-default rounded-2xl p-6 sm:p-8 shadow-xs"
			>
				<form onSubmit={onSubmit} noValidate className="space-y-6">
					{currentStep === 1 && (
						<StepLegal register={register} errors={errors} />
					)}
					{currentStep === 2 && (
						<StepContact register={register} errors={errors} />
					)}
					{currentStep === 3 && <StepFiscal register={register} />}
					{currentStep === 4 && <StepReview values={values} />}

					<WizardNavigation
						currentStep={currentStep}
						totalSteps={totalSteps}
						isSubmitting={isSubmitting}
						onPrev={prevStep}
						onNext={nextStep}
					/>
				</form>
			</section>
		</div>
	);
}
