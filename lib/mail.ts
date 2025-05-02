import { Resend } from "resend";

// 17.00- Variable de entorno API de Resend
const resend = new Resend(process.env.AUTH_RESEND_KEY);
// 17.01- También necesitaremos en "./env" la variable de entorno "NEXTAUTH_URL=", que por el momento será local "http://localhost:3000"

// 17.02- Guardamos la Función asincrona para enviar el email de verificación con parametros: email (usuario) y token de Verificación
export const sendMailVerification = async (email: string, token: string) => {
  try {
    // 17.03- Método de "Resend" que permite enviar el mail configurando la configuración del servicio
    await resend.emails.send({
      from: "NextAuth js <onboarding@resend.dev>", // Si no tenemos dominio en resend se debe asignar "onboarding@resend.dev"
      to: email, // Se envía al email del usuario
      subject: "Verify your email", // Asunto del Mail
      // Mensaje del Mail
      html: `
            <p>Click the link below to verify your email</p>
            <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}">Verify email</a>
        `,
    });
    // 17.04- Una vez enviado retornara "succes:true"
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
    };
  }
};
