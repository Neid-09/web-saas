"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	AlertCircle,
	CheckCircle2,
	AlertTriangle,
	Info,
	X,
} from "lucide-react";

export type ToastType = "error" | "success" | "warning" | "info";

export interface ToastProps {
	type: ToastType;
	message: string;
	title?: string;
	onClose?: () => void;
	autoCloseMs?: number;
	position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
}

const TOAST_TYPE_CONFIG: Record<
	ToastType,
	{
		defaultTitle: string;
		icon: React.ComponentType<{ className?: string }>;
		badgeClass: string;
		borderClass: string;
		shadowClass: string;
		titleClass: string;
	}
> = {
	error: {
		defaultTitle: "Error",
		icon: AlertCircle,
		badgeClass: "bg-danger/10 text-danger",
		borderClass: "border-danger/30",
		shadowClass: "shadow-danger/10",
		titleClass: "text-danger",
	},
	success: {
		defaultTitle: "Éxito",
		icon: CheckCircle2,
		badgeClass: "bg-checkout/10 text-checkout",
		borderClass: "border-checkout/30",
		shadowClass: "shadow-checkout/10",
		titleClass: "text-checkout",
	},
	warning: {
		defaultTitle: "Advertencia",
		icon: AlertTriangle,
		badgeClass: "bg-warning/10 text-warning",
		borderClass: "border-warning/30",
		shadowClass: "shadow-warning/10",
		titleClass: "text-warning",
	},
	info: {
		defaultTitle: "Información",
		icon: Info,
		badgeClass: "bg-brand-primary/10 text-brand-primary",
		borderClass: "border-brand-primary/30",
		shadowClass: "shadow-brand-primary/10",
		titleClass: "text-brand-primary",
	},
};

const POSITION_CLASSES: Record<NonNullable<ToastProps["position"]>, string> = {
	"top-right": "top-5 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96",
	"top-center":
		"top-5 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-96",
	"bottom-right": "bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96",
	"bottom-center":
		"bottom-5 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-96",
};

/**
 * Componente Base Compartido: Toast Flotante.
 * Pertenece a la capa `src/shared/ui/toast/`.
 * Diseñado para feedback transversal (alertas, errores, avisos transaccionales POS y éxito).
 * Garantiza cero desplazamiento de layout (CLS = 0) y animación horizontal suave.
 */
export function Toast({
	type,
	message,
	title,
	onClose,
	autoCloseMs = 5000,
	position = "top-right",
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isExiting, setIsExiting] = useState(false);

	// Activación suave de la animación de entrada
	useEffect(() => {
		const frame = requestAnimationFrame(() => setIsVisible(true));
		return () => cancelAnimationFrame(frame);
	}, []);

	// Animación de salida horizontal (de izquierda a derecha en 350ms)
	const handleDismiss = useCallback(() => {
		if (isExiting) return;
		setIsExiting(true);
		setTimeout(() => {
			onClose?.();
		}, 350);
	}, [isExiting, onClose]);

	// Cierre automático programado
	useEffect(() => {
		if (!autoCloseMs) return;
		const timer = setTimeout(() => {
			handleDismiss();
		}, autoCloseMs);
		return () => clearTimeout(timer);
	}, [autoCloseMs, handleDismiss]);

	const config = TOAST_TYPE_CONFIG[type];
	const Icon = config.icon;
	const positionClass = POSITION_CLASSES[position];

	return (
		<aside
			role={type === "error" ? "alert" : "status"}
			aria-live="polite"
			className={`fixed ${positionClass} z-50 transition-all duration-350 ease-out transform pointer-events-auto ${
				isVisible && !isExiting
					? "opacity-100 translate-x-0"
					: "opacity-0 translate-x-12 sm:translate-x-16 pointer-events-none"
			}`}
		>
			<div
				className={`rounded-2xl p-4 shadow-xl backdrop-blur-md border transition-all flex items-start gap-3.5 bg-surface ${config.borderClass} ${config.shadowClass}`}
			>
				{/* Icono de estado */}
				<div
					className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.badgeClass}`}
				>
					<Icon className="w-5 h-5" />
				</div>

				{/* Contenido textual */}
				<div className="flex-1 min-w-0 pt-0.5">
					<h4
						className={`text-xs font-bold font-heading mb-0.5 ${config.titleClass}`}
					>
						{title || config.defaultTitle}
					</h4>
					<p className="text-xs text-text-secondary font-body leading-relaxed">
						{message}
					</p>
				</div>

				{/* Botón de cierre manual */}
				{onClose && (
					<button
						type="button"
						onClick={handleDismiss}
						className="text-text-muted hover:text-text-secondary p-1 rounded-lg hover:bg-subtle transition-colors cursor-pointer"
						aria-label="Cerrar notificación"
					>
						<X className="w-4 h-4" />
					</button>
				)}
			</div>
		</aside>
	);
}
