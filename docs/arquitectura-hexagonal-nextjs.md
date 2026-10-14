# Arquitectura hexagonal en frontend con Next.js

Guía de referencia para adoptar la arquitectura en un proyecto: qué va en cada capa, cómo se conectan las piezas (composition root y Server Actions), dónde ubicar Zod, mappers, hooks y componentes.

---

## 1. Idea central

> **`domain` y `application` definen el esqueleto y los contratos. `infrastructure` contiene toda la implementación y las librerías.**

| Capa | Responde a | Conoce |
|---|---|---|
| `domain` | *Qué es* el negocio (entidades, reglas, contratos) | Nada externo |
| `application` | *Qué hace* el sistema (casos de uso) | Solo `domain` |
| `infrastructure` | *Cómo se hace* (fetch, Zod, mappers, storage) | `domain` + librerías |
| `ui` y `app/` | *Quién lo dispara* (clic, URL, request) | `application` / composition |

- `domain` y `application` dicen **qué** y **qué necesitan** (interfaces).
- `infrastructure` dice **cómo** (HTTP, Zod, Web Fetch, localStorage, mappers).
- `ui` y `app/` son **adaptadores de entrada**: reciben eventos del mundo y llaman a los casos de uso.

---

## 2. Regla de dependencias

```
ui / app (entrada) ──► application ──► domain ◄── infrastructure (salida)
```

- `domain` no importa nada de nadie.
- `application` solo importa de `domain`.
- `infrastructure` importa de `domain` (para implementar puertos) y de librerías externas.
- `ui` y `app/` importan de `application` o del `composition` para obtener casos de uso ya armados.
- **Nunca** al revés: `domain` jamás importa de `infrastructure`, `ui` ni de Next/React.

---

## 3. Estructura completa

```
src/
├── app/                                 # Next.js: rutas y entradas
│   └── products/
│       ├── page.tsx                     # Server Component
│       ├── actions.ts                   # Server Actions
│       └── api/route.ts                 # Route Handler (si hace falta)
│
├── modules/
│   └── products/                        # Un módulo por feature de negocio
│       ├── domain/                      # ESQUELETO
│       │   ├── Product.ts               # Entidad (interfaz + reglas puras)
│       │   ├── ProductRepository.ts     # PUERTO (interfaz)
│       │   └── errors.ts                # Errores de dominio
│       │
│       ├── application/                 # CASOS DE USO
│       │   ├── getProducts.ts
│       │   ├── createProduct.ts
│       │   └── types.ts                 # Tipos de entrada/salida (TS puro)
│       │
│       ├── infrastructure/              # IMPLEMENTACIÓN + LIBRERÍAS
│       │   ├── HttpProductRepository.ts     # Adaptador del puerto
│       │   ├── InMemoryProductRepository.ts # Adaptador para tests
│       │   ├── productSchema.ts         # Zod del contrato de la API
│       │   ├── productMapper.ts         # first_name ↔ firstName
│       │   └── composition.ts           # Composition root
│       │
│       └── ui/                          # ADAPTADOR DE ENTRADA (React)
│           ├── components/
│           ├── hooks/
│           └── schemas/                 # Zod solo de formularios
│
└── shared/                              # Transversal, sin lógica de negocio
    ├── ui/                              # Button, Modal, Input genéricos
    ├── hooks/                           # useDebounce, useMediaQuery
    ├── lib/                             # formatDate, cn
    └── infrastructure/                  # httpClient, config, env
```

---

## 4. Qué va en cada capa

### 4.1 `domain`: el esqueleto

**Contiene:** entidades, value objects, reglas de negocio puras, **puertos (interfaces)** y errores de dominio.
**Regla:** TypeScript puro. Sin React, sin Next, sin `fetch`, sin Zod.

```ts
// domain/Product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

export const applyDiscount = (p: Product, percent: number): Product => ({
  ...p,
  price: p.price * (1 - percent / 100),
});
```

```ts
// domain/ProductRepository.ts  → el CONTRATO (puerto)
import { Product } from "./Product";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  create(input: { name: string; price: number }): Promise<void>;
}
```

### 4.2 `application`: los casos de uso

**Contiene:** funciones que orquestan el dominio. Reciben los puertos por parámetro (inyección de dependencias).
**Regla:** solo conoce interfaces del dominio, nunca implementaciones.

```ts
// application/getProducts.ts
import { ProductRepository } from "../domain/ProductRepository";

export const getProducts = (repo: ProductRepository) => () => repo.findAll();
```

```ts
// application/createProduct.ts
import { ProductRepository } from "../domain/ProductRepository";

export const createProduct =
  (repo: ProductRepository) =>
  (input: { name: string; price: number }) =>
    repo.create(input);
```

### 4.3 `infrastructure`: implementación y librerías

**Contiene:** todo lo que habla con el exterior o usa librerías.

- Repositorios que implementan los puertos (`fetch`, localStorage).
- **Zod del contrato de la API** (validar lo que responde el backend).
- **Mappers** (`first_name` → `firstName`, en ambos sentidos).
- **Composition root** (donde se conecta cada puerto con su adaptador).

Aquí **sí** puedes depender de librerías externas: es justamente su trabajo.

**Mapper + Zod:**

```ts
// infrastructure/productMapper.ts
import { z } from "zod";
import { Product } from "../domain/Product";

const apiSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
});

// API → dominio (al leer)
export const toDomain = (raw: unknown): Product => {
  const dto = apiSchema.parse(raw);
  return { id: String(dto.id), name: dto.title, price: dto.price };
};

// dominio → API (al enviar)
export const toDto = (p: { name: string; price: number }) => ({
  title: p.name,
  price: p.price,
});
```

**Repositorio (adaptador):**

```ts
// infrastructure/HttpProductRepository.ts
import { ProductRepository } from "../domain/ProductRepository";
import { toDomain, toDto } from "./productMapper";

export class HttpProductRepository implements ProductRepository {
  async findAll() {
    const res = await fetch("https://api.example.com/products");
    return (await res.json()).map(toDomain);
  }

  async create(input: { name: string; price: number }) {
    await fetch("https://api.example.com/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toDto(input)),
    });
  }
}
```

> Si el backend cambia `first_name` por `name`, solo editas el schema y el mapper. Casos de uso, hooks y componentes siguen usando `user.firstName` sin enterarse.

### 4.4 `app/`: entradas de Next.js

**Contiene:** páginas, Server Actions y Route Handlers. Son adaptadores de entrada y **solo delegan** en los casos de uso. No tienen lógica de negocio.

Aquí se **valida con Zod el input que llega al servidor**, porque una Server Action es un endpoint público (ver sección 6).

### 4.5 `ui`: composición de la interfaz

| Directorio | Qué va | Qué NO va |
|---|---|---|
| `ui/components/` | Componentes que **solo pintan** y emiten eventos. Reciben datos por props o desde un hook. | `fetch`, reglas de negocio, mapeos de API |
| `ui/hooks/` | Custom hooks: `useState`, `useEffect`, React Query, `react-hook-form`. Conectan la UI con Server Actions. | Lógica de negocio pura (va en `domain`) |
| `ui/schemas/` | Zod **solo de formularios**: mensajes de error, `coerce`, campos extra como "confirmar contraseña". | Zod del contrato de la API (va en `infrastructure`) |

Cómo se compone:

```
ProductForm.tsx                  → solo JSX, llama al hook
   └─ useCreateProductForm.ts    → estado del form + zodResolver + mutation
        ├─ productFormSchema.ts  (ui/schemas)
        └─ createProductAction   (app/) → caso de uso → repositorio
```

**Los hooks nunca importan de `infrastructure` directamente.** Llaman a Server Actions; así el código de infraestructura no llega al navegador.

```tsx
// ui/schemas/productFormSchema.ts
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres"),
  price: z.coerce.number().positive("Ingresa un precio válido"),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;
```

```ts
// ui/hooks/useCreateProductForm.ts
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productFormSchema, ProductFormValues } from "../schemas/productFormSchema";
import { createProductAction } from "@/app/products/actions";

export function useCreateProductForm() {
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
  });

  const mutation = useMutation({
    mutationFn: createProductAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset();
    },
  });

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
```

```tsx
// ui/components/ProductForm.tsx
"use client";

import { useCreateProductForm } from "../hooks/useCreateProductForm";

export function ProductForm() {
  const { form, onSubmit, isPending } = useCreateProductForm();
  const { register, formState: { errors } } = form;

  return (
    <form onSubmit={onSubmit}>
      <input {...register("name")} placeholder="Nombre" />
      {errors.name && <p>{errors.name.message}</p>}

      <input type="number" {...register("price")} />
      {errors.price && <p>{errors.price.message}</p>}

      <button disabled={isPending}>Crear</button>
    </form>
  );
}
```

### 4.6 `shared/`: lo transversal

Componentes genéricos (`Button`), hooks reutilizables (`useDebounce`), utilidades, cliente HTTP base, variables de entorno. Si tiene lenguaje de negocio ("producto", "usuario"), **no** va aquí: va en su módulo.

---

## 5. Composition root: "el enchufe"

### El problema que resuelve

El caso de uso necesita un repositorio, pero **no sabe cuál**. Solo conoce la interfaz:

```ts
export const getProducts = (repo: ProductRepository) => () => repo.findAll();
```

Es como una lámpara: necesita electricidad, pero no le importa de dónde venga. Alguien tiene que **enchufarla a la pared**. Ese alguien es el composition root.

### Qué hace

Es **un único archivo** donde decides qué implementación concreta usa cada puerto, y exporta los **casos de uso ya listos** con el repositorio inyectado:

```ts
// infrastructure/composition.ts
import "server-only";
import { getProducts } from "../application/getProducts";
import { createProduct } from "../application/createProduct";
import { HttpProductRepository } from "./HttpProductRepository";

const repo = new HttpProductRepository();      // 1. elijo la implementación

export const productUseCases = {
  getProducts: getProducts(repo),              // 2. se la inyecto al caso de uso
  createProduct: createProduct(repo),
};
```

### Sin composition root vs. con composition root

Sin él, cada página repetiría:

```ts
const repo = new HttpProductRepository();
const products = await getProducts(repo)();
```

Si cambias a GraphQL, tendrías que editar **todos** los archivos. Con composition root cambias **una línea**:

```ts
const repo = new GraphqlProductRepository();   // solo esto cambia
```

### `import "server-only"`

Protección de Next.js: si alguien importa este archivo desde un componente cliente, **el build falla** en vez de enviar al navegador tu infraestructura (URLs, tokens, etc.).

### Para tests

Puedes tener otra composición con el repositorio falso. Mismo caso de uso, distinta "pared":

```ts
const repo = new InMemoryProductRepository([...]);
```

---

## 6. Server Actions: "una función del servidor que llamas desde el cliente"

### El problema que resuelve

El componente corre en el **navegador**, pero el repositorio y el composition root corren en el **servidor** (por eso `server-only`). ¿Cómo ejecuta el botón "Crear producto" código del servidor?

Tradicionalmente: crear un endpoint (`/api/products`), hacer `fetch`, parsear la respuesta. Una **Server Action** te ahorra eso: la escribes en el servidor y la **llamas desde el cliente como si fuera una función local**. Next.js hace el POST por debajo.

### Cómo se ve

```ts
// app/products/actions.ts
"use server";                                      // esto corre en el servidor

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { productUseCases } from "@/modules/products/infrastructure/composition";

const inputSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
});

export async function createProductAction(input: unknown) {
  const data = inputSchema.parse(input);           // 1. validar lo que llega
  await productUseCases.createProduct(data);       // 2. delegar al caso de uso
  revalidatePath("/products");                     // 3. refrescar la página
}
```

### Qué hace cada línea

1. **`inputSchema.parse(input)`**: una Server Action es un **endpoint público**. Cualquiera puede llamarla sin pasar por tu formulario. Nunca confíes en lo que llega.
2. **`productUseCases.createProduct(data)`**: la action no tiene lógica de negocio; solo delega.
3. **`revalidatePath("/products")`**: le dice a Next.js que los datos cambiaron y debe volver a pedirlos para actualizar la lista.

### Cuándo NO necesitas Server Action

Si la página solo **muestra datos**, es un Server Component y ya corre en el servidor: llama al composition directamente.

```tsx
// app/products/page.tsx
import { productUseCases } from "@/modules/products/infrastructure/composition";

export default async function ProductsPage() {
  const products = await productUseCases.getProducts();
  return <ProductList products={products} />;
}
```

---

## 7. Cómo se conectan todas las piezas

### Escritura (acción del usuario)

```
[Navegador]                              [Servidor]

ProductForm
   │ clic en "Crear"
   ▼
useCreateProductForm (hook: zodResolver de ui/schemas)
   │ llama como función
   ▼
createProductAction ──────────────────► (POST automático)
                                           │ 1. valida con Zod (app/)
                                           ▼
                                        productUseCases.createProduct   ← composition.ts
                                           │ (repo ya inyectado)
                                           ▼
                                        HttpProductRepository           [infrastructure]
                                           │ toDto + fetch
                                           ▼
                                        API externa
```

### Lectura (mostrar datos)

```
page.tsx (Server Component)
  → productUseCases.getProducts()        [composition]
     → getProducts(repo)                 [application]
        → ProductRepository (interfaz)   [domain]
           → HttpProductRepository       [infrastructure]
              → fetch + Zod + toDomain
```

### Por qué los hooks no llaman al composition directamente

El composition tiene `server-only` y contiene el repositorio real. Un hook corre en el navegador y **no puede importarlo**. La Server Action es el **puente permitido**: vive en el servidor (puede importar el composition) y es llamable desde el cliente.

### Regla para recordar

- **Leer datos** → Server Component llama al composition directamente.
- **Escribir / acciones del usuario** → Hook (cliente) → Server Action → composition → caso de uso.

---

## 8. Dónde va Zod

Zod **no es solo para formularios**: es una librería para verificar **en runtime** que un dato desconocido tiene la forma esperada. TypeScript solo comprueba tipos mientras programas; en ejecución los tipos desaparecen y `res.json()` devuelve `any`. Zod se coloca en **cada frontera por donde entran datos en los que no confías**.

| Para qué | Capa | Archivo |
|---|---|---|
| Validar respuesta de la API + traducir campos | `infrastructure` | `productMapper.ts` / `productSchema.ts` |
| Validar input de Server Action / Route Handler | `app/` | `actions.ts` |
| Validar formularios (UX, mensajes, `coerce`) | `ui/schemas` | `productFormSchema.ts` |
| Reglas de negocio | `domain` en TS puro (funciones) | `Product.ts` |

**Validar varias veces es intencional:**

- **Formulario**: feedback inmediato, mejor UX.
- **Server Action**: seguridad real (endpoint público).
- **DTO de infraestructura**: protege tu app de un backend que cambió o tiene un bug.

**Si solo usas Zod para formularios** → `ui/schemas`, junto al formulario. Si más tarde también lo usas en el servidor, muévelo a `application/` y que `ui` lo importe. Mover un archivo cuando surge la necesidad es trivial.

**Compromiso pragmático:** para no duplicar un schema entre `ui` y `app/`, puedes ponerlo en `application/` y reutilizarlo. Empieza estricto y relaja solo cuando duela.

**Alternativa a Zod:** Valibot, Yup, ArkType o validación manual. Zod es una herramienta, no parte de la arquitectura. Si el backend es tuyo y comparte tipos (tRPC, OpenAPI generado), a veces no necesitas validar la respuesta.

**Reglas de aislamiento:**

- El schema de la API **nunca sale de `infrastructure`**.
- Fuera de `infrastructure` solo circula el tipo del dominio (`User`, `Product`), no el `z.infer` del DTO.
- `ui` puede importar de `domain`; `domain` nunca importa de `ui`.

---

## 9. Mappers (adapter / DTO)

Cuando la API manda `first_name` y tu modelo usa `firstName`, la traducción vive en **`infrastructure`**, junto al repositorio.

- Nombres equivalentes: **mapper**, adapter (patrón Adapter), transformer, translator.
- En hexagonal, "adaptador" suele ser el repositorio completo; el mapper es una pieza pequeña **dentro** de él.
- **Debe ir en los dos sentidos:** `toDomain` (al leer) y `toDto` (al enviar). Es común olvidar el segundo.
- Ni componentes ni hooks deben conocer el formato `first_name`.

Variante con Zod, que valida y traduce en un solo paso:

```ts
const userSchema = z
  .object({ id: z.number(), first_name: z.string(), last_name: z.string() })
  .transform((dto) => ({
    id: String(dto.id),
    firstName: dto.first_name,
    lastName: dto.last_name,
  }));
```

Es cómodo; separar DTO y mapper es más legible y fácil de testear si el mapeo se complica.

---

## 10. Dónde ubicar cada tipo de pieza (guía rápida)

| Pieza | Ubicación |
|---|---|
| Interfaz de repositorio (puerto) | `domain` |
| Entidad y reglas puras | `domain` |
| Caso de uso | `application` |
| Repositorio concreto (`fetch`) | `infrastructure` |
| Zod de la API + mapper | `infrastructure` |
| Composition root | `infrastructure/composition.ts` |
| Server Action / Route Handler | `app/` |
| Custom hook (`useState`, React Query, RHF) | `ui/hooks` |
| Zod de formulario | `ui/schemas` |
| Componente de negocio | `ui/components` |
| Hook o componente genérico reutilizable | `shared/` |
| Estado global de UI (tema, sidebar) | `shared/ui` o store (Zustand) |

**Preguntas para decidir:**

- ¿Usa `useState`, `useEffect` o React Query? → `ui/hooks`.
- ¿Es una regla que el negocio defendería aunque cambies de framework? → `domain`.
- ¿Si cambio de backend, esto cambia? → `infrastructure`.
- ¿Si cambio de React a otro framework, esto cambia? → `ui`.

---

## 11. Testing por capa

| Capa | Cómo se prueba |
|---|---|
| `domain` | Test unitario puro, sin mocks |
| `application` | Con `InMemoryProductRepository`, sin red |
| `infrastructure` | Mapper con datos de ejemplo; repositorio con MSW o similar |
| `ui` | Testing Library, mockeando el hook o la action |

```ts
const repo = new InMemoryProductRepository([{ id: "1", name: "Mouse", price: 20 }]);
const products = await getProducts(repo)();
expect(products).toHaveLength(1);
```

---

## 12. Checklist para adoptarlo

1. Crea `modules/<feature>/` con `domain`, `application`, `infrastructure` y `ui` por cada feature de negocio.
2. Define primero **el modelo y el puerto** en `domain`.
3. Escribe el caso de uso en `application` contra la interfaz.
4. Implementa el repositorio, el mapper y el Zod de la API en `infrastructure`.
5. Conecta todo en `composition.ts` (con `server-only`).
6. Expón el caso de uso desde `app/` (page para leer, action para escribir) y valida el input con Zod.
7. Construye la UI: componente → hook → schema de formulario.
8. Añade `InMemory...Repository` para tests.

---

## 13. Errores comunes a evitar

- Importar `fetch`, Zod o React dentro de `domain` o `application`.
- Que un componente o hook conozca `first_name` (el formato de la API).
- Que los hooks importen repositorios o el composition directamente (arrastras infraestructura al cliente).
- Olvidar `server-only` en el composition.
- Olvidar el mapper de vuelta (`toDto`) al enviar datos.
- No validar el input de una Server Action por "ya validé en el formulario".
- Exportar el tipo `z.infer` del DTO fuera de `infrastructure`.
- Aplicarlo en todo: para un componente que solo pinta datos no hacen falta puertos.

---

## 14. Cuándo tiene sentido (y cuándo no)

**Tiene sentido:**

- Apps con reglas de negocio complejas (carritos, cálculos, flujos).
- Cuando quieres cambiar la fuente de datos (REST → GraphQL, otro backend) sin tocar la lógica.
- Cuando quieres testear la lógica sin renderizar componentes ni hacer peticiones.
- Equipos grandes o productos de larga vida.

**Es exagerado:**

- Landing pages, blogs, dashboards CRUD simples.
- Prototipos y proyectos pequeños.

**Alternativas cercanas:** Clean Architecture, Feature-Sliced Design, *screaming architecture*. A veces son más naturales en frontend.

---

## 15. Resumen en una página

| Pieza | Qué es | Analogía |
|---|---|---|
| `domain` | Entidades, reglas y puertos | El plano del edificio |
| `application` | Casos de uso contra interfaces | Lo que el edificio permite hacer |
| `infrastructure` | Repositorios, Zod, mappers, composition | Las instalaciones reales (cañerías, cables) |
| Composition root | Archivo que conecta puertos con adaptadores | El enchufe que conecta la lámpara a la pared |
| Server Action | Función del servidor llamable desde el cliente | Una ventanilla: el cliente pide, el servidor atiende |
| `server-only` | Candado contra bundles de cliente | Letrero "solo personal autorizado" |
| Mapper | Traduce API ↔ dominio | Un traductor en la frontera |
| Zod | Verifica datos desconocidos en runtime | Un control de aduana |

**Mantra:** el dominio define *qué*, la infraestructura define *cómo*, y la UI solo dispara casos de uso.
