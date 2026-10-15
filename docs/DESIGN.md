---
name: Web Desktop Admin & High-Speed POS (Design System)
description: Sistema de diseño oficial para desarrollo en Next.js 16 con Tailwind CSS v4 (@theme y @utility). Arquitectura de diseño no-plano, ergonomía Operate Mode POS (<10s) y referencias a fuentes de verdad oficiales.
---

# Sistema de Diseño para Desarrollo: High-Speed POS & Web Desktop Admin

**Guía Arquitectónica de Interfaz — Escuadrón 4**  
Este documento rige la arquitectura visual, layout y estándares de componentes para la implementación en **Next.js 16 y Tailwind CSS v4**.

> [!IMPORTANT] Fuentes de Verdad Oficiales (No Duplicación)
> Este documento no redefine de forma determinista las tablas cromáticas ni tipográficas completas. Para consultar los valores oficiales, el origen institucional y las reglas de aplicación detalladas, referirse a los siguientes documentos maestros:
> 
> * 📄 **Colorimetría y Paleta Institucional:** [`docs/identidad-visual/COLORIMETRIA.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/identidad-visual/COLORIMETRIA.md)
> * 📋 **Regla de Agente para Colores:** [`.agents/rules/colorimetria.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/colorimetria.md)
> * 📄 **Tipografía Institucional y Contable:** [`docs/identidad-visual/TIPOGRAFIA.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/identidad-visual/TIPOGRAFIA.md)
> * 📋 **Regla de Agente para Tipografía:** [`.agents/rules/tipografia.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/tipografia.md)

---

## 1. Arquitectura Técnica de Estilos: Estándar Tailwind CSS v4

El proyecto utiliza **Tailwind CSS v4** integrado con Turbopack. La configuración del sistema de diseño no se realiza mediante archivos `tailwind.config.js` heredados, sino a través de las directivas CSS nativas en [`src/app/globals.css`](file:///c:/dev-proyects/diplomado/web-diplomado/src/app/globals.css):

### A. La Directiva `@theme` (Generación de Clases Utilitarias)
Todos los tokens semánticos del sistema se registran en el bloque `@theme`. Esto hace que Tailwind genere automáticamente todas las clases estándar con soporte para variantes (`hover:`, `focus:`, `dark:`):

```css
@theme {
  /* Identidad UniPutumayo (Res. 0565) */
  --color-brand-primary: #18668F;
  --color-brand-primary-dark: #0F4A6B;
  --color-brand-primary-light: #2A8AB8;
  --color-brand-secondary: #80BF1F;
  --color-brand-accent: #F5A51D;
  --color-brand-neutral: #595957;

  /* Superficies y Bordes Operativos */
  --color-canvas: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-subtle: #F1F5F9;
  --color-border-default: #E2E8F0;
  --color-border-hover: #CBD5E1;

  /* Jerarquía de Textos Slate (WCAG AAA) */
  --color-text-primary: #0F172A;
  --color-text-secondary: #334155;
  --color-text-muted: #64748B;

  /* Semántica Transaccional POS */
  --color-checkout: #059669;
  --color-credit: #7C3AED;
  --color-warning: #D97706;
  --color-danger: #DC2626;

  /* Fuentes Google Fonts */
  --font-heading: var(--font-heading, 'Raleway', sans-serif);
  --font-body: var(--font-body, 'Fira Sans', sans-serif);
  --font-mono: var(--font-mono, 'JetBrains Mono', monospace);
}
```

**Uso directo en componentes:**
* `bg-brand-primary`, `hover:bg-brand-primary-dark`, `focus:ring-brand-primary-light`
* `bg-checkout`, `text-checkout`, `bg-credit`, `text-credit`
* `bg-canvas`, `bg-surface`, `border-border-default`
* `font-heading`, `font-body`, `font-mono`

### B. La Directiva `@utility` (Utilidades Complejas Reutilizables)
Para estilos con múltiples propiedades (como degradados y difuminados), se utiliza `@utility` para que se comporten como utilidades nativas de Tailwind compatibles con modificadores (`hover:`, `md:`):

* **`@utility bg-ambient-canvas`:** Malla de degradados radiales ultra sutiles (3% a 5% de opacidad) que evitan fondos planos y reducen la fatiga visual.
* **`@utility surface-glass`:** Superficie translúcida de vidrio esmerilado (`backdrop-blur-md`, borde translúcido y resplandor superior interno).
* **`@utility glow-checkout`:** Elevación con resplandor difuminado para el botón maestro `[F9]`.
* **`@utility tabular-nums`:** Alineación vertical decimal estricta obligatoria para cifras financieras.
* **`@utility custom-scrollbar`:** Micro-barra de desplazamiento delgada (6px) con riel transparente y transición suave.
* **`@utility scroll-fade-bottom`:** Máscara de desvanecimiento suave al pie de listas extensas.

---

## 2. Filosofía Operativa: "Operate Mode" (< 10 Segundos)

El módulo del mostrador POS sigue la filosofía de alta velocidad:
1. **Cero Dependencia de Ratón:** El 100% de la venta se realiza con teclado físico (`F2`, `F4`, `F9`, `F10`, `F12`, `Esc`).
2. **Jerarquía en Tres Tiempos Cognitivos:**
   * **0.1s – 0.2s (Imperativo):** Gran Total Monumental (en `font-mono tabular-nums`) y Botón `[F9] Cobrar`.
   * **0.2s – 0.5s (Operativo):** Entrada de SKU / lector de código de barras y tabla de artículos en venta.
   * **Bajo Demanda (>0.5s):** Menú lateral, desglose de IVA (19%) y ficha de cliente fiador.

---

## 3. Layout de Mostrador Desktop (5 Zonas Estructurales)

Optimizado para resoluciones comerciales estándar (**1366×768 px** hasta **1920×1080 px** Full HD):

```
+-----------------------------------------------------------------------------------------------------------------------------------+
| ZONA 2: TOPBAR (56px Glass): Sucursal Centro • Turno #04 Abierto • Cronómetro [<10s] • Estado Sync: Online • Usuario Cajero        |
+----------+-----------------------------------------------------------------+-----------------------------------------------------+
| ZONA 1:  | ZONA 3: CANVAS OPERATIVO CENTRAL (60% - 65% ancho)              | ZONA 4: PANEL DE LIQUIDACIÓN Y TICKET (35% - 40%)   |
| SIDEBAR  |                                                                 | (Superficie surface-glass sticky permanente)        |
| (Fijo    | +-------------------------------------------------------------+ | +-------------------------------------------------+ |
| 220px)   | | ENTRADA INMEDIATA: Input SKU / Código de Barras [F2 Catálogo]| | | CLIENTE: Cliente Mostrador / [F4] Cupo Fiado    | |
|          | +-------------------------------------------------------------+ | +-------------------------------------------------+ |
| • POS    |                                                                 | | RESUMEN COMPACTO DE ARTÍCULOS EN VENTA            | |
| • Stock  | TABLA ESPACIOSA DE ARTÍCULOS (py-3.5 a py-4, custom-scrollbar)  | | 1x Cemento Gris 50kg Arg.              $32.000    | |
| • Fiados | #  | Descripción            | Cant. | Unitario   | Subtotal    | | 2x Varilla Corrugada 1/2               $56.000    | |
| • Caja   | 01 | Cemento Gris 50kg Arg.  | [-1+] | $32.000    | $32.000     | +-------------------------------------------------+ |
| • Inform | 02 | Varilla Corrugada 1/2   | [-2+] | $28.000    | $56.000     | | Subtotal:                              $73.950    | |
| • Ajustes|                                                                 | | IVA (19% NIIF):                        $14.050    | |
|          |                                                                 | +-------------------------------------------------+ |
|          |                                                                 | | GRAN TOTAL A COBRAR (Número Monumental)         | |
|          |                                                                 | |               $ 88.000                            | |
|          |                                                                 | +-------------------------------------------------+ |
|          |                                                                 | | BOTÓN MAESTRO: [F9] COBRAR Y LIQUIDAR (Glow)    | |
|          |                                                                 | | Cobro Directo: [F10] Efectivo Exacto  [F12] Fia | |
+----------+-----------------------------------------------------------------+-----------------------------------------------------+
| ZONA 5: FOOTER (40px Glass): Atajos físicos: [F2] Catálogo  [F4] Cliente  [F9] Cobro  [F10] Efectivo  [F12] Fiado  [Esc] Cancelar   |
+-----------------------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Patrón de Feedback Asíncrono y Notificaciones Transversales (Toast UI)

Para garantizar la estabilidad visual y cumplir con los estándares de rendimiento Core Web Vitals (**CLS = 0.00**):

1. **Prohibición de Banners Dinámicos:** Prohibido insertar alertas o banners inline en formularios o en el mostrador POS que empujen los elementos o alteren la posición de botones e inputs.
2. **Componente Estándar:** Todo mensaje de confirmación, advertencia o fallo de servidor debe emitirse mediante el componente compartido:
   `import { Toast } from '@/shared/ui/toast';`
3. **Comportamiento Físico:** El Toast flota desacoplado (`top-5 right-6 z-50`), entra deslizándose horizontalmente de derecha a izquierda, se auto-cierra en 5 segundos y se retira suavemente de izquierda a derecha en 350ms.
4. **Semántica:**
   * `error`: Rojo `danger` (`#DC2626`) para fallos de red o transacciones denegadas.
   * `success`: Verde `checkout` (`#059669`) para ventas cerradas y guardados confirmados.
   * `warning`: Ámbar `warning` (`#D97706`) para advertencias de inventario o cupos fiados.
   * `info`: Azul `brand-primary` (`#18668F`) para información de turnos y sincronización.

---

## 5. Referencias Rápidas y Reglas de Desarrollo

Para la implementación de componentes y vistas, seguir las reglas de negocio establecidas:

* **Colores y Contrastes:** Consultar siempre [`docs/identidad-visual/COLORIMETRIA.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/identidad-visual/COLORIMETRIA.md).
* **Tipografías y `tabular-nums`:** Consultar siempre [`docs/identidad-visual/TIPOGRAFIA.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/identidad-visual/TIPOGRAFIA.md).
* **Feedback y Notificaciones UI:** Consultar siempre [`.agents/rules/ui-feedback.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/ui-feedback.md).
* **Estructura de Archivos y Módulos:** Consultar [`.agents/rules/project-structure.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/project-structure.md).
* **Enrutamiento y RBAC:** Consultar [`.agents/rules/nextjs-routing.md`](file:///c:/dev-proyects/diplomado/web-diplomado/.agents/rules/nextjs-routing.md).
