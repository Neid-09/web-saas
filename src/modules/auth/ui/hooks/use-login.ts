"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/app/(auth)/login/actions";
import { loginSchema, LoginFormData } from "../schemas/login.schema";

export interface UseLoginReturn {
	form: ReturnType<typeof useForm<LoginFormData>>;
	isLoading: boolean;
	loginError: string | null;
	loginSuccess: boolean;
	showPassword: boolean;
	toggleShowPassword: () => void;
	dismissError: () => void;
	onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function useLogin(): UseLoginReturn {
	const router = useRouter();
	const searchParams = useSearchParams();
	const targetRedirect = searchParams.get("redirect");

	const [isLoading, setIsLoading] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const [loginSuccess, setLoginSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
		mode: "onTouched",
	});

	const onSubmit = form.handleSubmit(async (data: LoginFormData) => {
		setIsLoading(true);
		setLoginError(null);

		try {
			// Invoca el Server Action seguro: valida credenciales y resuelve safeRedirect en el servidor
			const res = await loginAction(data, targetRedirect);

			if (!res.success || !res.destination) {
				setLoginError(res.error || "Ocurrió un error inesperado al iniciar sesión");
				return;
			}

			setLoginSuccess(true);

			setTimeout(() => {
				router.push(res.destination!);
			}, 700);
		} catch (error) {
			if (error instanceof Error) {
				setLoginError(error.message);
			} else {
				setLoginError("Ocurrió un error inesperado al iniciar sesión");
			}
		} finally {
			setIsLoading(false);
		}
	});

	return {
		form,
		isLoading,
		loginError,
		loginSuccess,
		showPassword,
		toggleShowPassword: () => setShowPassword((prev) => !prev),
		dismissError: () => setLoginError(null),
		onSubmit,
	};
}
