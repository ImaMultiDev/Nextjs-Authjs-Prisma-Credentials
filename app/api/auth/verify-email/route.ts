import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  //01- Si no se encuentra el Token
  if (!token) {
    return new Response("Token not found", { status: 400 });
  }

  // 02- Constante para verificar y guardar el token de la base de datos en dicha constante, en caso de existir en la BD
  const verifyToken = await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  });

  // 02a- Si no existe en la base de datos
  if (!verifyToken) {
    return new Response("Token not found", { status: 400 });
  }
  // 02b -> Si existe el token en la base de datos:

  // 03- Verificar si el token ya ha expirado (recordemos que el atributo expires es de tipo Date)
  if (verifyToken.expires < new Date()) {
    return new Response("Token expired", { status: 400 });
  }

  // 04- Comprobar si el email ya fué verificado
  const user = await prisma.user.findUnique({
    where: {
      email: verifyToken.identifier,
    },
  });
  // 04a- Esta verificado
  if (user?.emailVerified) {
    return new Response("Email already verified", { status: 400 });
  }

  // 04b- No esta verificado -> Lo marcamos como verificado
  await prisma.user.update({
    where: {
      email: verifyToken.identifier,
    },
    data: {
      emailVerified: new Date(), // Para marcarlo como verificado asignamos la fecha, ya que el atributo "user.emailVerified es de tipo Date"
    },
  });

  // 05- Una vez actualizado el atributo "emailVerified" debemos eliminar el token
  await prisma.verificationToken.delete({
    where: {
      identifier: verifyToken.identifier,
    },
  });

  // Una vez terminado el proceso, redirigimos al usuario a la ruta "/login"
  redirect("/login?verified=true");

  // Para hacerlo correctamente le hemos añadido un Query Parameter "verified=true" que deberá recibir app\(auth)\login\page.tsx

  // return Response.json({ token });
}
