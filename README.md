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

##### [Configuración dividida🌐](https://authjs.dev/guides/edge-compatibility#split-config)

---

### 6. Implementar Credential Providers

https://authjs.dev/getting-started/authentication/credentials

Una vez tenemos listos los archivos de configuración de auth para el Provider.
[auth.ts🌐](auth.ts)
[auth.config.ts](auth.config.ts)

Vamos a crear un archivo para la lógica del lado del servidor:
[actions/auth-actions.ts🌐](actions/auth-actions.ts)

Una vez tenemos la acción que deseamos ejecutar en el servidor para acceder con las credenciales a la sesión con **_jwt_**, ahora en el lado del cliente, en el formulario podemos llamar a esta función de forma asincrona:

[components/form-login.tsx🌐](components/form-login.tsx)

```tsx
"use client";
import { signIn } from "@/auth";
async function onSubmit(values: z.infer<typeof loginSchema>) {
  await loginAction(values);
}
```

Vamos a configurar también la función de **SingOut** de Next-Auth, pero esta vez lo haremos directamente **del lado del cliente**

[SingOut Client🌐](https://authjs.dev/getting-started/session-management/login#:~:text=%7D-,Desconectar,-El%20cierre%20de)

Lo importamos en la página del dashboard para ver su funcionalidad

---

### 7. Capturar los errores con Auth-error

[authjs.AuthError🌐](https://authjs.dev/reference/core/errors#:~:text=AuthError-,AuthError,-Base%20error%20class)

---

### 8. Configurar Base de Datos con Prisma

[Auth.js-prisma-postgresql🌐](https://authjs.dev/getting-started/adapters/prisma#:~:text=consultas%20en%20%C3%A9l.-,Esquema,-Necesita%20usar%20al)

---

### 9. Sesiones JWT y gestión de usuarios

---

### 10. Gestión de usuarios y roles

Para configurar los roles y permitir que haya opción de **_Admin_** en la aplicación lo primero sería dirigirnos a la ruta ==app\(protected)\admin\page.tsx== y hacer que solo puedan acceder a ella los usuarios que tengan **_Admin_** como **_Role_**

[app/(protected)/admin/page.tsx🌐](<app/(protected)/admin/page.tsx>)

De esta forma si el usuario es Admin verá el contenido de la ruta pero si no lo es le mostrará:
"You are not admin"

Pero esto no va a funcionar ya que **_role_** esta definido tan solo en la base de datos, no tenemos nada sobre el en lo que viene a ser la lógica de la aplicación.

Si accedemos a **_prisma studio_** podemos dar doble click en uno de los usuarios en su campo de **role** y asignarle "**_admin_**" directamente desde la base de datos, pero aun así como ya digo no tenemos una lógica que nos permita saber que ese usuario es un **_admin_** dentro de la aplicación.

##### [Extendiendo la Sesión🌐](https://authjs.dev/guides/extending-the-session)

---

### 9. Middleware (protección rutas)

El middleware también nos permite proteger las rutas que no deseamos que sean públicas

[middleware.ts🌐](middleware.ts)

```typescript
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

// 15.00- Borramos la exportación de la configuración por defecto "authConfig" (15.01)
const { auth: middleware } = NextAuth(authConfig);

// 15.05- Declaramos un array con las rutas que queremos hacer públicas
const publicRoutes = ["/", "/login", "/register", "/api/auth/verify-email"];

// 15.01- Ahora extendemos "middleware" exportando nuestra propia configuración por defecto (15.02)
export default middleware((req) => {
  // 15.02- Arrow fun del "request", para destructurar sacando "nextUrl" y "auth(sesión usuario)" (15.03)
  const { nextUrl, auth } = req; // 15.03- Estos vienen de NextAuthConfig (auth.config.ts)
  const isLoggedIn = !!auth?.user; // 15.04- Añadir doble exclamación nos devuelve "true" o "false"

  // PROTEGER /dashboard /admin
  // 15.06- Si no esta incluido en publicRoutes y no esta logeado (15.07)
  if (!publicRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
    // 15.07- Retornamos un NextResponse.redirect a la url "login" impidiendo el acceso
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  //15.08- En caso contrario, retornamos NextResponse.next(aceptando el acceso)
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Omite los elementos internos de Next.js y todos los archivos estáticos, a menos que se encuentren en los parámetros de búsqueda
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Ejecutar siempre para rutas API
    "/(api|trpc)(.*)",
  ],
};
```

---

### 9. Verificación de Email (Resend)

Para verificar el e-mail del usuario disponemos en nuestro [prisma/schema.prisma](prisma/schema.prisma) del modelo **_VerificationToken_**

```typescript
model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@id([identifier, token])
}
```

Ahora nos dirigimos a nuestro archivo de configuración de Auth donde asignaremos la lógica correspondiente para la verificación.
Pero antes vamos a instalar algo que nos será necesario para generar los tokens que expiraran cada 24 horas y se trata de **nano**

```bash
npm i nanoid
```

Una vez que disponemos de este, vamos a configurar la verificación de user por e-mail:

[auth.config.ts🌐](auth.config.ts)

#### RESEND

https://resend.com/docs/send-with-nextjs
Como proveedor de servicio para el envio de correos de verificación vamos a usar **_Resend_**, así que comenzamos accediendo a su plataforma
En Add Api Key le damos nombre a la Api (NextAuthTest), Permission y Domain por defecto.

Una vez tenemos la API en nuestras variables de entorno, instalamos el servicio

```bash
npm i resend
```

Una vez instalado creamos un archivo para implementar la configuración de **_Resend_**
[lib/mail.ts🌐](lib/mail.ts)

Como podemos ver en el contenido del mail, tenemos una variable de enttorno que debemos añadir a nuestro `.env` Y de momento para el desarrollo pondremos lo siguiente:

```
NEXTAUTH_URL="http://localhost:3000"
```

Una vez tenemos ya la parte del servicio configurada volvemos a `auth.config.ts` para completar la lógica de enviar email de verificación. Simplemente creamos una constante a la que le asignamos la función (await) sendEmailVerification dandole como parámetros "email" y "token"

[auth.config.ts](auth.config.ts)

Ahora necesitamos crear la ruta que le indicamos en el archivo `middleware.ts` en las rutas públicas

```typescript
const publicRoutes = ["/", "/login", "/register", "/api/auth/verify-email"];
```

Que a su vez también aparece en el link del contenido de `lib/mail.ts`

```typescript
 <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}">Verify email</a>
```

Una vez comprobado que coinciden creamos la ruta [app/api/auth/verify-email/route.ts](app/api/auth/verify-email/route.ts) donde inicialmente recibimos el token

```typescript
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  return Response.json({ token });
}
```

E implementamos las verificaciones del token:
[app/api/auth/verify-email/route.ts🌐](app/api/auth/verify-email/route.ts)

De este modo, nos faltaría dirigirnos a [app/(auth)/login/page.tsx🌐](<app/(auth)/login/page.tsx>) para que reciba el Query Parameter adecuadamente

Y por último, debemos añadir como hemos asignado a [components/form-login.tsx🌐](components/form-login.tsx) ese props: "**isVerified**"

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
