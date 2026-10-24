---
description: Reglas obligatorias para la jerarquía tipográfica, escala estándar de tamaños de fuente, fuentes oficiales y alineación de números tabulares en el frontend.
globs: "src/app/**/*.{tsx,jsx,css}, src/modules/**/*.{tsx,jsx,css}, src/shared/**/*.{tsx,jsx,css}"
alwaysApply: true
---

# Reglas de Tipografía, Escala de Tamaños y Formato Numérico — Squad 4

Este documento establece las directrices oficiales y obligatorias para la aplicación tipográfica en la interfaz del SaaS Contable y POS Desktop.

> **Fuente de verdad oficial de fuentes y manual institucional:**  
> Consultar siempre [`docs/identidad-visual/TIPOGRAFIA.md`](file:///c:/dev-proyects/diplomado/web-diplomado/docs/identidad-visual/TIPOGRAFIA.md) y el Manual de Identidad Visual UniPutumayo (Res. 0565).

---

## 1. Familias Tipográficas Oficiales

1. **Títulos y Encabezados Institucionales (`font-heading`):**
   - Fuente: **`Raleway`** (Google Fonts).
   - Uso: Títulos de página `h1`-`h4`, nombres de módulos, modales y cabeceras institucionales.
   - Variantes autorizadas: `font-heading font-semibold` (600), `font-heading font-bold` (700), `font-heading font-extrabold` (800).

2. **Cuerpo de Texto, Formularios y Tablas (`font-body`):**
   - Fuente: **`Fira Sans`** (Google Fonts).
   - Uso: Párrafos descriptivos, tablas administrativas densas, inputs, navegación y etiquetas.
   - Variantes autorizadas: `font-body font-normal` (400), `font-body font-medium` (500), `font-body font-semibold` (600).

3. **Cifras Monetarias, Código y Atajos Físicos (`font-mono`):**
   - Fuente: **`JetBrains Mono`** (Google Fonts).
   - Uso: Gran total POS monumental, precios unitarios, IVA (19%), devuelta, SKU/códigos de barras y teclas `<kbd>`.
   - Variantes autorizadas: `font-mono font-medium` (500), `font-mono font-bold` (700).

---

## 2. Escala Estandarizada Oficial de Tamaños de Fuente

Queda **PROHIBIDO** el uso de corchetes arbitrarios (ej. `text-[10px]`, `text-[11px]`, `text-[13px]`, `text-[28px]`).  
Toda la interfaz debe adherirse exclusivamente a la siguiente escala tipográfica:

| Token / Clase | Rem / Píxeles | Leading (Interlineado) | Tracking (Espaciado) | Rol en la Interfaz (UI Element) | Familia Obligatoria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`text-2xs`** | `0.625rem` (10px) | `leading-tight` (14px) | `tracking-widest uppercase font-bold` | Micro-badges, overlines, pills de estado | `font-body` / `font-mono` |
| **`text-xs`** | `0.75rem` (12px) | `leading-normal` (16px) | `tracking-normal` o `tracking-wider` | Badges, subtítulos breves, metadatos, captions | `font-body` / `font-mono` |
| **`text-sm`** | `0.875rem` (14px) | `leading-relaxed` (20px) | `tracking-normal` | Tablas densas, descripciones, formularios compactos | `font-body` |
| **`text-base`** | `1.00rem` (16px) | `leading-normal` (24px) | `tracking-normal` | Cuerpo general de texto, inputs principales, botones | `font-body` |
| **`text-lg`** | `1.125rem` (18px) | `leading-snug` (28px) | `tracking-tight` | Subtítulos H4, tarjetas destacadas, totales secundarios | `font-heading` / `font-mono` |
| **`text-xl`** | `1.25rem` (20px) | `leading-snug` (28px) | `tracking-tight` | Encabezados de sección H3, métricas de dashboard | `font-heading` / `font-mono` |
| **`text-2xl`** | `1.50rem` (24px) | `leading-tight` (32px) | `tracking-tight` | Títulos H2 de panel y módulos | `font-heading` |
| **`text-3xl`** | `1.875rem` (30px) | `leading-tight` (36px) | `tracking-tight font-extrabold` | Títulos principales H1 de vistas | `font-heading` |
| **`text-4xl`** | `2.25rem` (36px) | `leading-tight` (40px) | `tracking-tight font-extrabold` | Hero headers destacados, login hero | `font-heading` |
| **`text-5xl`** | `3.00rem` (48px) | `leading-none` (48px) | `tracking-tight font-extrabold` | Hero institucional, Gran Total POS mediano | `font-heading` / `font-mono` |
| **`text-6xl`** | `3.75rem` (60px) | `leading-none` (60px) | `tabular-nums font-bold` | **Gran Total POS Monumental (< 10s)** | `font-mono` |

---

## 3. Adaptación Responsive y Resoluciones de Pantalla

El sistema opera en hardware comercial variado (desde laptops de 1366px hasta monitores Full HD y terminales táctiles):

1. **Uso de Breakpoints Estándar:**
   - Dispositivos compactos / Tablets: `pos-compact:` o `lg:` (1024px)
   - Laptops comerciales y pantallas POS HD: `pos-hd:` (1366px)
   - Pantallas de backoffice Full HD: `pos-fhd:` (1920px)

2. **Títulos Responsivos Fluídos:**
   - Título principal H1: `text-2xl sm:text-3xl`
   - Hero Display: `text-3xl sm:text-4xl xl:text-5xl`
   - Gran Total POS: `text-4xl lg:text-5xl pos-hd:text-6xl`

3. **Condición de Legibilidad para Micro-textos (`text-2xs`):**
   - El tamaño `text-2xs` (10px) se permite **únicamente** cuando se acompaña de:
     * `uppercase` (letras mayúsculas obligatorias para evitar confusión visual).
     * `tracking-widest` o `tracking-wider` (kerning expandido para mantener legibilidad WCAG AAA).
     * `font-bold` o `font-semibold`.
   - Si el texto está en minúsculas (caja baja) o es un párrafo, el tamaño mínimo estricto es **`text-xs`** (12px).

---

## 4. Reglas Financieras y Numéricas

1. **Regla Obligatoria `tabular-nums`:**
   - **TODOS** los precios, cantidades, subtotales, impuestos (IVA 19%) y cambio deben incluir la clase `tabular-nums font-mono`.
   - Esto impide que los números "salten" o se desalineen verticalmente cuando el cajero modifica cantidades a alta velocidad.

2. **Formateo Monetario:**
   - Toda cifra en pesos colombianos debe renderizarse mediante la utilidad unificada de formateo en `src/shared/utils/currency.ts` (formato COP: `$ 32.000`).

