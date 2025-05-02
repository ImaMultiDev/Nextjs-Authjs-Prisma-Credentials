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
