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

[`./lib/utils.ts`](lib/utils.ts)🌐

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

[`./lib/zod.ts`]()🌐

---

### 2. Estructura de Enrutamiento (App Router)

- Rutas públicas (auth)
  Rutas disponibles para usuarios no autenticados:
  `./app/(auth)/login/page.tsx` → Página de login
  `./app/(auth)/register/page.tsx` → Página de registro

- Rutas protegidas (protected)
  Rutas seguras bajo middleware, requieren cumplir autenticación y rol de usuario o admin:
  `./app/(protected)/dashboard/page.tsx`→ Panel principal del usuario
  `app/(protected)/admin/page.tsx` → Solo accesible para usuarios con rol "admin"

### 3. Formularios Frontend

Creamos los formularios del lado del Cliente ("use client") como componente en [`components\form-login.tsx🌐`](components/form-login.tsx) y [`components/form-register.tsx🌐`](components/form-register.tsx), fuera del enrutamiento, y una vez creado lo importamos en [`app\(auth)\login\page.tsx🌐`](<app/(auth)/login/page.tsx>) y [`app\(auth)\register\page.tsx🌐`](<app/(auth)/register/page.tsx>)

Formulario Login
Formulario Registro

---

### 4. Instalación y configuración inicial de Auth.js

---

### 5. Configuración de Prisma ORM y Base de Datos PostgreSQL

---

### 6. Implementación Providers de autenticación

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
