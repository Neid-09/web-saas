---
name: sequential-atomic-workflow
description: Metodología paso a paso para descomponer y ejecutar requerimientos de desarrollo en micro-tareas atómicas secuenciales bajo Arquitectura Hexagonal y Next.js 16. Proporciona plantillas de checklists, guías de commits atómicos y criterios de verificación capa por capa.
---

# Skill: Flujo de Desarrollo Secuencial y Atómico (Squad 4)

Este skill define la metodología operativa para descomponer requerimientos técnicos de cualquier tamaño en **secuencias de micro-tareas atómicas**, garantizando que cada cambio sea pequeño, fácil de revisar, modular y 100% compatible con la arquitectura hexagonal del SaaS.

---

## 1. El Ciclo de Entrega Atómica

Cada requerimiento se ejecuta siguiendo este ciclo iterativo:

```
[Requerimiento] ──► [Checklist de Micro-Tareas] ──► [Aprobación del Usuario]
                                                             │
┌────────────────────────────────────────────────────────────┘
│
▼
┌──► 1. Ejecutar UNA micro-tarea (Diff < 80 líneas)
│    2. Verificar compilación TypeScript
│    3. Notificar archivo modificado + Commit sugerido
│    4. Marcar [x] en el Checklist
└──── ¿Hay más tareas? ──(Sí)──► Siguiente micro-tarea
                        ──(No)──► Feature completa y lista para PR
```

---

## 2. Plantillas de Checklists por Tipo de Tarea

### Plantilla A: Nueva Funcionalidad Completa (Ej: Gestión de Sucursales / Clientes)
```markdown
### Plan Atómico: [Nombre de la Funcionalidad]
- [ ] 1. Dominio: Entidad y tipos puros en `src/modules/<feature>/domain/<entity>.ts`.
- [ ] 2. Dominio: Contrato del repositorio en `src/modules/<feature>/domain/<entity>Repository.ts`.
- [ ] 3. Aplicación: Caso(s) de uso puro(s) en `src/modules/<feature>/application/<action>UseCase.ts`.
- [ ] 4. Infraestructura: Esquemas Zod del API y DTOs en `src/modules/<feature>/infrastructure/schemas/`.
- [ ] 5. Infraestructura: Implementación `Http<entity>Repository` en `infrastructure/repositories/`.
- [ ] 6. Infraestructura: Registro en `src/modules/<feature>/infrastructure/composition.ts`.
- [ ] 7. UI: Hook de consulta/mutación con TanStack Query en `ui/hooks/use<Feature>.ts`.
- [ ] 8. UI: Componentes visuales semánticos en `src/modules/<feature>/ui/components/`.
- [ ] 9. App: Thin Page en `src/app/(dashboard)/<route>/page.tsx` + `loading.tsx` y `error.tsx`.
```

### Plantilla B: Nuevo Formulario o Mutación (Ej: Crear / Editar Registro)
```markdown
### Plan Atómico: Formulario [Nombre de la Mutación]
- [ ] 1. Aplicación: Caso de uso puro `create<Entity>UseCase.ts` con validación de reglas de negocio.
- [ ] 2. Infraestructura: Método `save` / `update` en `Http<Entity>Repository.ts` con cabecera de idempotencia si aplica.
- [ ] 3. UI / Schemas: Esquema Zod de validación de formulario en `ui/schemas/<entity>FormSchema.ts` (con mensajes en español).
- [ ] 4. UI / Hooks: Hook de mutación con TanStack Query y feedback Toast en `ui/hooks/useCreate<Entity>.ts`.
- [ ] 5. UI / Componentes: Componente de formulario accesible (HTML5 semántico, sin useEffect) en `ui/components/`.
- [ ] 6. Integración: Inserción en la vista o modal declarativo correspondiente.
```

### Plantilla C: Componente de Alta Velocidad para POS
```markdown
### Plan Atómico: Componente POS [Nombre]
- [ ] 1. Estado / Store: Definir slice o selector en el store de Zustand (`src/modules/pos/ui/store/`).
- [ ] 2. Ergonomía / Teclado: Atajos de teclado declarativos con `<kbd>` y eventos de tecla (`F1`-`F12`, `Esc`).
- [ ] 3. UI Component: Renderizado a 60 FPS con números monoespaciados (`font-mono tabular-nums`).
- [ ] 4. Integración: Acople al mostrador principal en `src/app/(pos)/pos/page.tsx`.
```

---

## 3. Convención de Commits Atómicos Sugeridos

Para mantener el historial de Git limpio y facilitar revisiones en Pull Requests, cada micro-tarea completada debe sugerir un commit convencional con el formato:

| Capa | Formato del Commit | Ejemplo |
| :--- | :--- | :--- |
| **Dominio** | `feat(<modulo>): define <entidad> domain model and repository port` | `feat(branches): define branch model and repository port` |
| **Aplicación** | `feat(<modulo>): implement <nombre> use case` | `feat(branches): implement list-branches use case` |
| **Infraestructura** | `feat(<modulo>): implement http repository and composition root` | `feat(branches): implement http repository and composition root` |
| **UI Hooks** | `feat(<modulo>): add react query hook for <feature>` | `feat(branches): add react query hook for branches` |
| **UI Components**| `feat(<modulo>): add <component-name> component` | `feat(branches): add branch-card list component` |
| **App Router** | `feat(<modulo>): mount page, loading skeleton and error boundary` | `feat(branches): mount branches dashboard page and loading skeleton` |
| **Refactor** | `refactor(<modulo>): simplify <elemento>` | `refactor(pos): extract tender total calculation to domain pure function` |

---

## 4. Criterios de Aceptación por Micro-Paso

Antes de marcar una subtarea como `[x]` y dar el paso siguiente:
1. **Compilación Limpia:** No debe haber errores de compilación de TypeScript (`tsc`).
2. **Cero Clases Arbitrarias:** No introducir corchetes `bg-[#...]` ni `text-[#...]` (usar tokens `@theme`).
3. **Cero `useEffect` en UI:** Todo diálogo, cálculo o cierre debe ser declarativo.
4. **Formato Financiero:** Si intervienen precios, monedas o cantidades, verificar la clase `font-mono tabular-nums`.
5. **Completitud:** Prohibidos los `TODO` o métodos vacíos. Si el paso requiere una función, debe quedar implementada.

---

## 5. Manejo de Desviaciones o Imprevistos

Si durante la ejecución de una micro-tarea se detecta un problema o necesidad imprevista:
1. **Pausar la ejecución:** No intentar resolver el imprevisto mezclando código en la tarea actual.
2. **Ajustar el Checklist:** Agregar una subtarea intermedia específica (ej: `2.1. Crear helper de redondeo financiero`).
3. **Validar con el usuario:** Explicar el motivo del ajuste y continuar secuencialmente.
