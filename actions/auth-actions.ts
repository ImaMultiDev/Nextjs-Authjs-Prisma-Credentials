"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";
import errorMap from "zod/locales/en.js";

// LOGIN
export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      const message = error.message || "Authentication failed";

      return { error: message };
    }

    return { error: "Unexpected error during login" };
  }
};

// REGISTRO
export const registerAction = async (
  values: z.infer<typeof registerSchema>
) => {
  try {
    const { data, success } = registerSchema.safeParse(values);
    if (!success) {
      return {
        error: "Invalid data",
      };
    }

    // Verificar si el usuario ya existe
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (user) {
      return {
        error: "User already exists",
      };
    }

    // hash del password (si existe)
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Crear el usuario
    await prisma.user.create({
      data: {
        email: data.email,
        password: passwordHash,
        name: data.name,
      },
    });

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      const message = error.message || "Authentication failed";

      return { error: message };
    }

    return { error: "Unexpected error during login" };
  }
};
