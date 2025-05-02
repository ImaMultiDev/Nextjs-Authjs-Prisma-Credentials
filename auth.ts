import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  session: { strategy: "jwt" },
  callbacks: {
    // jwt() se ejecuta cada vez que se crea o actualiza un token JWT.
    // Aquí es donde puedes agregar info adicional al token
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.role = user.role;
      }
      return token;
    },
    // session() se utiliza para agregar la info del token a la sesión del usuario,
    // lo que hace que esté disponible en el cliente
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
});
