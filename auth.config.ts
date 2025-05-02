import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./lib/zod";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sendMailVerification } from "./lib/mail";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid credentials");
        }

        // Verificar si existe el usuario
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

        // Como asignamos el password como opcional, para otros providers, debemos comprobar que en Credentials exista
        if (!user || !user.password) {
          throw new Error("Not user found");
        }

        // Verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // 16.00- VERIFICACIÓN DE E-MAIL
        // 16.01- Si el usuario no tiene su e-mail verificado
        if (!user.emailVerified) {
          // 16.02- Verificamos si ya existe un token de verificación
          const verifyTokenExists = await prisma.verificationToken.findFirst({
            where: {
              identifier: user.email,
            },
          });
          // 16.03- Si el token de verificación ya existe lo eliminamos
          if (verifyTokenExists?.identifier) {
            await prisma.verificationToken.delete({
              where: {
                identifier: user.email,
              },
            });
          }
          // 16.04- Creamos un nuevo token de verificación con nanoid
          const token = nanoid();

          // 16.05- Una vez creado lo asignamos al usuario y lo guardamos en la base de datos
          await prisma.verificationToken.create({
            data: {
              identifier: user.email,
              token, // Token que hemos creado
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // Fecha de expiración (24 Horas)
            },
          });

          // 16.06- Enviar email de verificación
          await sendMailVerification(user.email, token);
          throw new Error("Please check Email send verification");
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
