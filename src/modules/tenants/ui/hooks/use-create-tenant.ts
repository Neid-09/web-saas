"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createTenantFormSchema,
	CreateTenantFormData,
	STEP_1_FIELDS,
	STEP_2_FIELDS,
	STEP_3_FIELDS,
} from "../schemas/create-tenant.schema";
import { createTenantAction } from "@/app/(dashboard)/dashboard/tenants/actions";
import { tenantsKeys } from "./use-tenants";
import { Tenant } from "../../domain/tenant.entity";

export const TOTAL_WIZARD_STEPS = 4;

export function useCreateTenant() {
	const [currentStep, setCurrentStep] = useState<number>(1);
	const queryClient = useQueryClient();

	const form = useForm<CreateTenantFormData>({
		resolver: zodResolver(createTenantFormSchema),
		defaultValues: {
			nitRut: "",
			businessName: "",
			tradeName: "",
			address: "",
			phone: "",
			email: "",
			countryCode: "COL",
			currencyCode: "COP",
			taxRegime: "RESPONSABLE_IVA",
		},
		mode: "onTouched",
	});

	const mutation = useMutation({
		mutationFn: async (data: CreateTenantFormData): Promise<Tenant> => {
			const res = await createTenantAction({
				...data,
				tradeName: data.tradeName || data.businessName,
			});

			if (!res.success || !res.data) {
				throw new Error(res.error || "No fue posible registrar la empresa.");
			}

			return new Tenant(res.data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tenantsKeys.all });
		},
	});

	const nextStep = async (): Promise<boolean> => {
		let fieldsToValidate: readonly (keyof CreateTenantFormData)[] = [];

		if (currentStep === 1) fieldsToValidate = STEP_1_FIELDS;
		if (currentStep === 2) fieldsToValidate = STEP_2_FIELDS;
		if (currentStep === 3) fieldsToValidate = STEP_3_FIELDS;

		const isValid = await form.trigger(fieldsToValidate);
		if (isValid) {
			setCurrentStep((prev) => Math.min(TOTAL_WIZARD_STEPS, prev + 1));
			return true;
		}

		return false;
	};

	const prevStep = (): void => {
		setCurrentStep((prev) => Math.max(1, prev - 1));
	};

	const goToStep = (step: number): void => {
		if (step >= 1 && step < currentStep) {
			setCurrentStep(step);
		}
	};

	const onSubmit = form.handleSubmit(async (data: CreateTenantFormData) => {
		await mutation.mutateAsync(data);
	});

	return {
		form,
		currentStep,
		totalSteps: TOTAL_WIZARD_STEPS,
		nextStep,
		prevStep,
		goToStep,
		onSubmit,
		isSubmitting: mutation.isPending || form.formState.isSubmitting,
		isSuccess: mutation.isSuccess,
		error: mutation.error ? mutation.error.message : null,
		createdTenant: mutation.data ?? null,
		resetMutation: mutation.reset,
	};
}
