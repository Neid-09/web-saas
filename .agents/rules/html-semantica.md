---
description: Reglas obligatorias de semántica HTML5, prevención de divitis, jerarquía de encabezados y accesibilidad WCAG.
globs:
  - src/app/**/*.tsx
  - src/app/**/*.jsx
  - src/modules/**/*.tsx
  - src/modules/**/*.jsx
  - src/shared/**/*.tsx
  - src/shared/**/*.jsx
alwaysApply: true
---

# Reglas de Semántica HTML5 y Prevención de Divitis — Squad 4

Este documento establece las directrices obligatorias de arquitectura semántica HTML5, jerarquía de encabezados y accesibilidad (WCAG 2.1 AA) para el SaaS Comercial, Backoffice y Mostrador POS.

---

## 1. Principio Fundamental: Tolerancia Cero a la "Divitis"

En este proyecto, el elemento `<div>` está reservado **única y exclusivamente para maquetación visual técnica**:
* Contenedores auxiliares de CSS Flexbox o Grid.
* Envolturas de posicionamiento `relative`, `absolute` o `fixed`.
* Capas de gradientes, efectos de cristal (*glassmorphism*) o máscaras de recorte (`overflow-hidden`).

**PROHIBIDO** utilizar `<div>` cuando exista una etiqueta semántica nativa de HTML5 que describa el propósito del contenido o su función en el árbol de accesibilidad.

---

## 2. Landmarks Estructurales Obligatorios

Toda vista o componente de diseño debe estructurarse mediante las regiones estándar de HTML5:

| Elemento | Propósito Obligatorio | Cuándo Usarlo (Ejemplos) |
| :--- | :--- | :--- |
| **`<main>`** | Contenedor principal único por página. | Raíz de toda página en `src/app/` (`/login`, `/dashboard`, `/pos`, `not-found`, `forbidden`). Prohibido envolver páginas completas en un simple `<div>`. |
| **`<header>`** | Encabezado contextual. | Barra superior global (Topbar), encabezados de tarjetas (`login-form`), encabezados de vista o panel de caja. |
| **`<footer>`** | Pie contextual o institucional. | Copyright inferior, pie de tarjeta de resumen, totales de ticket en mostrador. |
| **`<nav>`** | Bloques de navegación y enlaces. | Sidebar de módulos, breadcrumbs, pestañas (tabs), paginación y botoneras de acciones de redirección (ej. en 404/403). Debe incluir siempre `aria-label`. |
| **`<aside>`** | Contenido tangencial o complementario. | Sidebar administrativo colapsable, tarjeta Hero lateral institucional (`login-hero-card`), panel lateral de desglose de impuestos o fiado. |
| **`<section>`** | Sección temático-funcional autónoma. | Tarjeta de formulario de acceso, bloque de métricas del dashboard, panel de teclado virtual o búsqueda de productos en POS. Debe identificarse con `aria-labelledby`. |
| **`<article>`** | Entidad de contenido autocontenido. | Ficha de producto en catálogo, tarjeta de turno de caja, ítem de factura o reporte contable independiente. |

---

## 3. Jerarquía Estricta de Encabezados (H1 – H6)

1. **Un solo `<h1>` por documento:**
   * Cada ruta debe renderizar **exactamente un elemento `<h1>` visible** que sintetice el propósito primario de la pantalla.
   * **PROHIBIDO** esconder el `<h1>` con clases responsivas como `hidden lg:hidden` dejando la vista de escritorio huérfana de título principal.
2. **Progresión sin saltos arbitrarios:**
   * La estructura de títulos debe descender de forma natural: `<h1>` → `<h2>` → `<h3>`.
   * **PROHIBIDO** saltar niveles (por ejemplo, pasar de `<h1>` directamente a `<h4>`).
3. **Encabezados en componentes secundarios:**
   * Las tarjetas o paneles secundarios deben utilizar `<h2>` o `<h3>` según su anidamiento jerárquico.

---

## 4. Listas Semánticas Obligatorias (`<ul>`, `<ol>`, `<li>`)

Cualquier conjunto repetitivo de datos o elementos relacionados debe ser una lista semántica:
* **PROHIBIDO** mapear colecciones usando `div` anidados:
  ```tsx
  {/* ❌ INCORRECTO: "Divitis" en colecciones */}
  <div className="space-y-3">
    {items.map(item => <div key={item.id}>{item.title}</div>)}
  </div>
  ```
* **OBLIGATORIO** utilizar listas nativas con `role="list"` para mantener la accesibilidad sin estilos de viñeta por defecto:
  ```tsx
  {/* ✅ CORRECTO: Lista semántica */}
  <ul role="list" className="space-y-3 list-none p-0">
    {items.map(item => (
      <li key={item.id}>{item.title}</li>
    ))}
  </ul>
  ```

---

## 5. Formularios y Campos de Entrada

1. **Estructura Semántica de Formulario:**
   * Formularios declarados con `<form noValidate onSubmit={...}>`.
   * Cuando existan múltiples campos o secciones relacionadas, agruparlos dentro de un `<fieldset>` con su `<legend>` (usar la clase `sr-only` si el diseño no requiere el texto visualmente).
2. **Asociación Estricta de Etiquetas:**
   * Todo `<input>`, `<select>` o `<textarea>` debe contar con su correspondiente `<label htmlFor="...">` enlazado por su atributo `id`.
   * Para campos de diseño flotante o minimalista donde la etiqueta no sea visible, incluir `aria-label` o `className="sr-only"`.
3. **Accesibilidad en Validaciones y Estados:**
   * Entradas inválidas deben marcarse con `aria-invalid={Boolean(errors.field)}`.
   * Mensajes de error enlazados al input mediante `aria-describedby="campo-error"`.

---

## 6. Interactividad y Elementos Decorativos

1. **Acciones Clickeables:**
   * **PROHIBIDO** asignar manejadores de clic `onClick` a elementos `<div>` o `<span>`.
   * Si la acción navega a otra URL: utilizar `<Link href="...">` de `next/link`.
   * Si la acción ejecuta lógica o abre un modal: utilizar `<button type="button">` o `<button type="submit">`.
2. **Elementos Puramente Decorativos:**
   * Todo icono vectorial (`lucide-react`), separador gráfico, borde decorativo o barra de progreso visual sin texto debe marcarse con `aria-hidden="true"`.

---

## 7. Tabla Resumen: Anti-Patrones vs. Solución Estándar

| Anti-Patrón ("Divitis") | Solución Semántica Obligatoria |
| :--- | :--- |
| `<div className="min-h-screen">...</div>` (página) | `<main className="min-h-screen">...</main>` |
| `<div className="card"><h2>Título</h2></div>` | `<section aria-labelledby="id"><header><h2 id="id">...</h2></header></section>` |
| `<div className="flex gap-2"><Link... /><Link... /></div>` | `<nav aria-label="Navegación"><Link... /><Link... /></nav>` |
| `<div className="items">{items.map(... => <div />)}</div>` | `<ul role="list">{items.map(... => <li />)}</ul>` |
| `<div onClick={submit}>Guardar</div>` | `<button type="submit">Guardar</button>` |
| `<div className="hero-banner">` (lateral) | `<aside aria-label="Descripción">` |
