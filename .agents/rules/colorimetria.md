---
description: Reglas obligatorias para el uso de colorimetría, tokens y paletas cromáticas en el desarrollo de la interfaz de usuario.
globs: ["src/app/**/*.{tsx,jsx,css}", "src/modules/**/*.{tsx,jsx,css}", "src/shared/**/*.{tsx,jsx,css}"]
alwaysApply: true
---

# Reglas de Colorimetría y Uso de Color — Squad 4

Este documento establece las directrices obligatorias para la aplicación de colores y temas en la interfaz del SaaS Contable y POS.

> **Fuente de verdad oficial de valores y manual institucional:**  
> Consultar siempre [`docs/identidad-visual/COLORIMETRIA.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/identidad-visual/COLORIMETRIA.md) y el manual UniPutumayo (Res. 0565).

---

## 1. Principios de Aplicación Cromática

1. **Uso Exclusivo de Clases de Tailwind `@theme`:**
   - **PROHIBIDO** el uso de colores arbitrarios en línea (ej. `bg-[#18668F]`, `text-[#059669]`, `style={{ color: ... }}`).
   - Utilizar siempre las clases semánticas autogeneradas en `src/app/globals.css`:
     * `bg-brand-primary`, `hover:bg-brand-primary-dark`, `focus:ring-brand-primary-light`
     * `bg-brand-secondary`, `text-brand-secondary`
     * `bg-brand-accent`, `text-brand-accent`
     * `bg-canvas`, `bg-surface`, `bg-subtle`
     * `text-text-primary`, `text-text-secondary`, `text-text-muted`
     * `bg-checkout`, `bg-credit`, `bg-warning`, `bg-danger`

2. **Segregación entre Backoffice y Mostrador POS:**
   - **Backoffice / Dashboard (Branding Institucional):** El eje cromático dominante es el **Azul UniPutumayo (`brand-primary`)** para barras, botones principales y navegación.
   - **Mostrador POS (Operate Mode):**
     * El fondo **NUNCA** debe ser blanco puro ni negro puro; debe utilizar la utilidad atmosférica `bg-ambient-canvas` o `bg-canvas`.
     * **El color verde (`checkout`) es sagrado:** Reservado exclusivamente para la liquidación final del dinero y botón `[F9]`. Ningún otro elemento debe competir con este verde.
     * **El crédito / fiado (`credit`) es violeta:** Nunca debe pintarse de rojo; el crédito es una venta válida de confianza.

3. **Superficies con Profundidad No-Plana:**
   - Utilizar la clase `@utility surface-glass` para tarjetas flotantes, topbar y modales en lugar de fondos planos opacos.
   - Utilizar `@utility glow-checkout` para el botón de cobro.

4. **Contraste y Accesibilidad (WCAG AAA):**
   - Todos los textos sobre fondos claros deben usar `text-text-primary` (`#0F172A`) o `text-text-secondary` (`#334155`), garantizando un contraste superior a 14:1.
