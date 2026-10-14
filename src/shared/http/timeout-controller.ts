export interface TimeoutController {
	signal: AbortSignal;
	cleanup: () => void;
	didTimeout: () => boolean;
}

/**
 * Crea un controlador de cancelación con tiempo de espera configurable.
 * Permite distinguir si el aborto se originó por timeout o por señal externa,
 * y limpia listeners y temporizadores.
 *
 * @param timeoutMs      - Tiempo máximo de espera en milisegundos
 * @param externalSignal - Señal de cancelación externa opcional
 */
export function createTimeoutController(
	timeoutMs: number,
	externalSignal?: AbortSignal,
): TimeoutController {
	const controller = new AbortController();
	let timedOut = false;

	const timeoutId = setTimeout(() => {
		timedOut = true;
		controller.abort();
	}, timeoutMs);

	const onExternalAbort = () => {
		controller.abort();
	};

	if (externalSignal?.aborted) {
		controller.abort();
	} else if (externalSignal) {
		externalSignal.addEventListener("abort", onExternalAbort, { once: true });
	}

	const cleanup = () => {
		clearTimeout(timeoutId);
		if (externalSignal) {
			externalSignal.removeEventListener("abort", onExternalAbort);
		}
	};

	return {
		signal: controller.signal,
		cleanup,
		didTimeout: () => timedOut,
	};
}
