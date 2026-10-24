---
description: Regla estricta que prohíbe el uso de valores arbitrarios en corchetes para Tailwind CSS (ej. bg-[#...], text-[#...], w-[...], etc.), obligando a usar tokens semánticos definidos en @theme.
globs: "src/**/*.{tsx,jsx,ts,js,css}"
alwaysApply: true
---

# Regla Estricta: Prohibición de Clases Arbitrarias en Tailwind CSS

Esta regla es de **cumplimiento obligatorio y tolerancia cero** en todo el código fuente del proyecto (`Squad 4`).

---

## 1. La Regla de Oro: Cero Valores en Corchetes `[...]`

Queda **PROHIBIDO TERMINANTEMENTE** escribir clases arbitrarias con corchetes en cualquier propiedad:

### A. Colores, Fondos y Bordes
* ❌ `bg-[#80BF1F]` $\rightarrow$ ✅ **`bg-brand-secondary`**
* ❌ `bg-[#18668F]` $\rightarrow$ ✅ **`bg-brand-primary`**
* ❌ `hover:bg-[#0F4A6B]` $\rightarrow$ ✅ **`hover:bg-brand-primary-dark`**
* ❌ `text-[#18668F]` $\rightarrow$ ✅ **`text-brand-primary`**
* ❌ `text-[#0E5B6E]` $\rightarrow$ ✅ **`text-brand-primary-dark`**
* ❌ `bg-[#F8FAFC]` $\rightarrow$ ✅ **`bg-canvas`**
* ❌ `text-[#0F172A]` $\rightarrow$ ✅ **`text-text-primary`**
* ❌ `bg-[#059669]` $\rightarrow$ ✅ **`bg-checkout`**
* ❌ `text-[#7C3AED]` $\rightarrow$ ✅ **`text-credit`**
* ❌ `border-[#E2E8F0]` $\rightarrow$ ✅ **`border-border-default`**

### B. Tamaños de Fuentes e Interlineado (Tipografía)
* ❌ `text-[10px]` $\rightarrow$ ✅ **`text-2xs`** (token oficial en `@theme` con `tracking-widest uppercase`)
* ❌ `text-[11px]` $\rightarrow$ ✅ **`text-xs`** (o `text-2xs` si es badge técnico)
* ❌ `text-[13px]` $\rightarrow$ ✅ **`text-sm`** (14px estándar) o **`text-xs`** (12px)
* ❌ `text-[32px]` $\rightarrow$ ✅ **`text-3xl`** (30px) o **`text-4xl`** (36px)
* ❌ `leading-[1.12]` $\rightarrow$ ✅ **`leading-tight`** o **`leading-none`**

### C. Breakpoints y Tamaños de Pantalla
* ❌ `min-[1366px]:...` $\rightarrow$ ✅ **`pos-hd:...`** (token `--breakpoint-pos-hd: 1366px`)
* ❌ `max-[1024px]:...` $\rightarrow$ ✅ **`max-lg:...`** o **`pos-compact:...`**
* ❌ `min-[1920px]:...` $\rightarrow$ ✅ **`pos-fhd:...`** (token `--breakpoint-pos-fhd: 1920px`)
* Usar siempre la escala estándar responsive: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`, o los breakpoints POS definidos en `@theme`.

### D. Dimensiones, Radios y Transformaciones
* ❌ `w-[48%]`, `w-[50%]` $\rightarrow$ ✅ **`w-1/2`**, **`w-5/12`**, **`w-7/12`**
* ❌ `w-[420px]` $\rightarrow$ ✅ **`max-w-md w-full`** o **`w-96`**
* ❌ `rounded-[2.25rem]` $\rightarrow$ ✅ **`rounded-card`** / **`rounded-card-sm`** / **`rounded-3xl`**
* ❌ `active:scale-[0.99]` $\rightarrow$ ✅ **`active:scale-95`** o **`active:opacity-90`**

---

## 2. Tabla de Equivalencias de Tokens Semánticos (`@theme`)

Todo valor que desees utilizar DEBE provenir de los tokens registrados en `@theme` en [`src/app/globals.css`](file:///c:/dev-proyects/diplomado/web-diplomado/src/app/globals.css):

### Colores
| Hex / Rol | Token Semántico `@theme` | Clases Tailwind Permitidas |
| :--- | :--- | :--- |
| `#18668F` (Azul UniPutumayo) | `--color-brand-primary` | `bg-brand-primary`, `text-brand-primary`, `border-brand-primary` |
| `#0F4A6B` (Azul Oscuro Hover) | `--color-brand-primary-dark` | `hover:bg-brand-primary-dark`, `text-brand-primary-dark` |
| `#2A8AB8` (Azul Claro Activo) | `--color-brand-primary-light` | `focus:ring-brand-primary-light`, `text-brand-primary-light` |
| `#80BF1F` (Verde Institucional) | `--color-brand-secondary` | `bg-brand-secondary`, `text-brand-secondary`, `border-brand-secondary` |
| `#F5A51D` (Naranja Alerta) | `--color-brand-accent` | `bg-brand-accent`, `text-brand-accent` |
| `#595957` (Gris Institucional) | `--color-brand-neutral` | `bg-brand-neutral`, `text-brand-neutral` |
| `#F8FAFC` (Lienzo Slate 50) | `--color-canvas` | `bg-canvas` |
| `#FFFFFF` (Superficie Blanca) | `--color-surface` | `bg-surface` |
| `#F1F5F9` (Gris Sutil Slate 100)| `--color-subtle` | `bg-subtle` |
| `#E2E8F0` (Borde Slate 200) | `--color-border-default` | `border-border-default` |
| `#CBD5E1` (Borde Hover Slate 300)| `--color-border-hover` | `border-border-hover` |
| `#0F172A` (Texto Slate 900) | `--color-text-primary` | `text-text-primary` |
| `#334155` (Texto Slate 700) | `--color-text-secondary` | `text-text-secondary` |
| `#64748B` (Texto Slate 500) | `--color-text-muted` | `text-text-muted` |
| `#059669` (Verde Cobro POS) | `--color-checkout` | `bg-checkout`, `text-checkout`, `ring-checkout` |
| `#7C3AED` (Violeta Fiado POS) | `--color-credit` | `bg-credit`, `text-credit` |
| `#D97706` (Ámbar Alerta Stock) | `--color-warning` | `bg-warning`, `text-warning` |
| `#DC2626` (Rojo Cancelar/Error) | `--color-danger` | `bg-danger`, `text-danger` |

### Fuentes y Tamaños
| Tamaño / Token | Token `@theme` | Clases Tailwind Permitidas | Uso Oficial |
| :--- | :--- | :--- | :--- |
| `10px (0.625rem)` | `--text-2xs` | `text-2xs` | Micro-badges y overlines (`uppercase tracking-widest`) |
| `12px (0.75rem)` | Estándar Tailwind | `text-xs` | Badges, subtítulos breves, metadatos, notas |
| `14px (0.875rem)` | Estándar Tailwind | `text-sm` | Tablas densas, descripción secundaria, formularios compactos |
| `16px (1.00rem)` | Estándar Tailwind | `text-base` | Cuerpo principal de texto, campos input, botones estándar |
| `18px (1.125rem)`| Estándar Tailwind | `text-lg` | Subtítulos H4, tarjetas destacadas |
| `20px (1.25rem)` | Estándar Tailwind | `text-xl` | Encabezados de sección H3, métricas |
| `24px (1.50rem)` | Estándar Tailwind | `text-2xl` | Títulos H2 de panel y módulos |
| `30px (1.875rem)`| Estándar Tailwind | `text-3xl` | Títulos principales H1 de vistas |
| `36px (2.25rem)` | Estándar Tailwind | `text-4xl` | Hero headers destacados |
| `48px (3.00rem)` | Estándar Tailwind | `text-5xl` | Hero institucional, Gran Total POS mediano |
| `60px (3.75rem)` | Estándar Tailwind | `text-6xl` | Gran Total POS Monumental (`font-mono tabular-nums`) |

### Breakpoints de Pantalla y Hardware Comercial
| Ancho Mínimo | Token `@theme` | Prefijo Tailwind | Dispositivo / Entorno |
| :--- | :--- | :--- | :--- |
| `640px` | Estándar Tailwind | `sm:` | Móviles apaisados / Pantallas táctiles compactas |
| `768px` | Estándar Tailwind | `md:` | Tablets verticales |
| `1024px` | `--breakpoint-pos-compact` | `lg:` / `pos-compact:` | Tablets POS apaisadas (iPad, Galaxy Tab Mostrador) |
| `1280px` | Estándar Tailwind | `xl:` | Laptops estándar (1280x800) |
| `1366px` | `--breakpoint-pos-hd` | `pos-hd:` | Resolución estándar comercial POS (Laptops 14", pantallas POS táctiles HD) |
| `1536px` | Estándar Tailwind | `2xl:` | Monitores de escritorio amplios |
| `1920px` | `--breakpoint-pos-fhd` | `pos-fhd:` | Pantallas de Backoffice y Mostrador Full HD |

---

## 3. ¿Qué hacer si necesitas un nuevo token o valor?

* **NUNCA** recurrir a valores en corchetes `[...]` en los componentes.
* **Procedimiento obligatorio:**
  1. Abrir [`src/app/globals.css`](file:///c:/dev-proyects/diplomado/web-diplomado/src/app/globals.css).
  2. Agregar el nuevo token semántico dentro del bloque `@theme` (ej: `--color-nuevo-token: #...;`, `--text-nuevo-token: ...;`, `--breakpoint-nuevo: ...;`).
  3. Utilizar la clase oficial autogenerada en los componentes.

