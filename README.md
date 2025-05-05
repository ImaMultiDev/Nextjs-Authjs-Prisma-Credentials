# Proyecto Auth.js con Next.js y Prisma

Este proyecto implementa autenticación avanzada con Auth.js utilizando Next.js, Prisma ORM, PostgreSQL y herramientas frontend como Shadcn UI.

---

## Indice

---

- [1. Instalación y Configuración Inicial](#instalación-y-configuración-inicial)
- [2. Estructura de Enrutamiento (App Router)](#2-estructura-de-enrutamiento-app-router)
- [3. Formularios Frontend](#3-formularios-frontend)
- [4. Instalación y configuración inicial de Auth.js](#4-instalación-y-configuración-inicial-de-authjs)
- [5. Configuración de Prisma ORM y Base de Datos PostgreSQL](#5-configuración-de-prisma-orm-y-base-de-datos-postgresql)
- [6. Implementación Providers de autenticación](#6-implementación-providers-de-autenticación)
- [7. Sesiones JWT y gestión de usuarios](#7-sesiones-jwt-y-gestión-de-usuarios)
- [8. Gestión avanzada de usuarios](#8-gestión-avanzada-de-usuarios)
- [9. Verificación de Email](#9-verificación-de-email)
- [10. Mejoras de experiencia de usuario (UX)](#10-mejoras-de-experiencia-de-usuario-ux)

---

## Guía

---

### 1. Instalación y Configuración Inicial

---

#### [🌐Instalación de Next.js (Documentación)](https://nextjs.org/docs/app/getting-started/installation)

```bash
npx create-next-app@latest
```

```bash
What is your project named? my-app
Would you like to use TypeScript? Yes
Would you like to use ESLint? Yes
Would you like to use Tailwind CSS? Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) Yes
Would you like to use Turbopack for `next dev`?  No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
```

---

#### [🌐Instalación Shadcn UI](https://ui.shadcn.com/docs/installation/next)

```bash
npx shadcn@latest init
```

Este archivo debería agregarse automáticamente con la instalación de shadcn

[lib/utils.ts](lib/utils.ts)🌐

---

#### [🌐Instalar Componentes Shadcn](https://ui.shadcn.com/docs/components)

##### [1. Instalar button](https://ui.shadcn.com/docs/components/button)

```bash
npx shadcn@latest add button
```

##### [2. Instalar label](https://ui.shadcn.com/docs/components/label)

```bash
npx shadcn@latest add label
```

##### [3. Instalar input](https://ui.shadcn.com/docs/components/input)

```bash
npx shadcn@latest add input
```

##### [4. Instalar form](https://ui.shadcn.com/docs/components/form)

```bash
npx shadcn@latest add form
```

_La instalación del componente "form" instala automáticamente **"zod"** para validaciones_

---

#### [🌐Validación con Zod](https://zod.dev/?id=from-npm)

Creamos archivo para configuración de zod y añadimos el siguiente contenido para validación de inputs en los componentes **form**

[lib/zod.ts](lib/zod.ts)🌐

---

### 2. Estructura de Enrutamiento (App Router)

<img src="./public/img/AppRouterImg.png" width="200" />

#### Rutas públicas (auth)

Rutas disponibles para usuarios no autenticados:

**Página de login**
[app/(auth)/login/page.tsx🌐](<`app/(auth)/login/page.tsx`>)

**Página de registro**
[app/(auth)/register/page.tsx🌐](<`app/(auth)/login/page.tsx`>)

#### Rutas protegidas (protected)

Rutas seguras bajo middleware, requieren cumplir autenticación y rol de usuario o admin:

**Dashboard**
[app/(protected)/dashboard/page.tsx🌐](<app/(protected)/dashboard/page.tsx>)

**Ruta solo accesible para usuarios con "role=admin"**
[app/(protected)/admin/page.tsx🌐](<app/(protected)/admin/page.tsx>)

### 3. Formularios Frontend

Creamos los formularios del lado del Cliente("use client") como componentes, fuera del enrutamiento:
[components/form-login.tsx🌐](components/form-login.tsx)
[components/form-register.tsx🌐](components/form-register.tsx)

Una vez creados, los importamos en
[app\(auth)\login\page.tsx🌐](<app/(auth)/login/page.tsx>)
[app\(auth)\register\page.tsx🌐](<app/(auth)/register/page.tsx>)

---

### 4. Instalación y configuración inicial de Auth.js

https://authjs.dev/getting-started/installation

```
npm install next-auth@beta
```

**Variable de entorno secreta**

```bash
npx auth secret
```

Almacenamos la clave generada en:
[.env.local]()

```bash
AUTH_SECRET="clave"
```

**Creamos el archivo inicial de configuración de Auth.ts:**
[auth.ts🌐](auth.ts)

**Creamos la API route especial de auth:**
[app/api/auth/[...nextauth]/route.ts🌐](app/api/auth/[...nextauth]/route.ts)

**Creamos el archivo inicial para el middleware:**
[middleware.ts🌐](middleware.ts)

```typescript
export { auth as middleware } from "@/auth";
```

Antes de comenzar a implementar los providers, vamos a instalar la base de datos con **Prisma**

---

### 5. Configuración de Prisma ORM y Base de Datos PostgreSQL

https://authjs.dev/getting-started/adapters/prisma

```bash
npm install @prisma/client @auth/prisma-adapternpm
install prisma --save-dev
```

**Iniciar Prisma**

```bash
npx prisma init
```

Para trabajar con prisma necesitaremos disponer de una base de datos, inicialmente crearemos una base de datos con **_postgresql en pgAdmin_** para trabajar de forma local. Yo la llamaré, por ejemplo, _auth_nextjs_. Una vez creada debemos añadir a las variables de entorno globales la siguiente variable con la información de nuestro servidor.

[.env]()

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/bdName?schema=public"
```

Para mejorar el rendimiento Prisma, podemos configurar la instancia de Prisma para garantizar que solo se cree una instancia en todo el proyecto y luego importarla desde cualquier archivo según sea necesario.
[lib\prisma.ts🌐](lib\prisma.ts)

#### Edge Compatibility

Debemos implementar una solución a problemas de compatibilidad experimentados con **Edge**, la solución alternativa original para el tiempo de ejecución de la base de datos, que consiste en dividir la configuración en dos.

##### [Configuración dividida](https://authjs.dev/guides/edge-compatibility#split-config)

---

### 6. Implementar Credential Providers

https://authjs.dev/getting-started/authentication/credentials

Una vez tenemos listos los archivos de configuración de auth para el Provider.
[auth.ts](auth.ts)
[auth.config.ts](auth.config.ts)

Vamos a crear un archivo para la lógica del lado del servidor:
[actions/auth-actions.ts](actions/auth-actions.ts)

Una vez tenemos la acción que deseamos ejecutar en el servidor para acceder con las credenciales a la sesión con **_jwt_**, ahora en el lado del cliente, en el formulario podemos llamar a esta función de forma asincrona:

[components/form-login.tsx](components/form-login.tsx)

```tsx
"use client";
import { signIn } from "@/auth";
async function onSubmit(values: z.infer<typeof loginSchema>) {
  await loginAction(values);
}
```

[SingOut Client](https://authjs.dev/getting-started/session-management/login#:~:text=%7D-,Desconectar,-El%20cierre%20de)

---

### 7. Sesiones JWT y gestión de usuarios

---

### 8. Gestión de usuarios y roles

---

### 9. Verificación de Email (Resend)

---

### Bibliografía:

Tutorial:https://www.youtube.com/watch?v=vkV4wApku5s&t=1768s

Next.js Documentation – [https://nextjs.org/docs](https://nextjs.org/docs)
Auth.js Documentation – [https://authjs.dev](https://authjs.dev)
Compatibilidad y optimización en Edge – [https://authjs.dev/guides/edge-compatibility](https://authjs.dev/guides/edge-compatibility)
Shadcn UI Components – [https://ui.shadcn.com](https://ui.shadcn.com)
Prisma ORM – [https://www.prisma.io](https://www.prisma.io)
Resend - [https://resend.com/](https://resend.com/)

---
