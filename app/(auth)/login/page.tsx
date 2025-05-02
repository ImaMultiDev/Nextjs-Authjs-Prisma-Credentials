import FormLogin from "@/components/form-login";
import React from "react";

const LoginPage = ({
  // Recibe el Query Params de "app\api\auth\verify-email\route.ts"
  searchParams,
}: {
  // tipamos el prop con "verified"
  searchParams: { verified: string };
}) => {
  // Creamos una constante para indicar que ha sido verificado, y poder mandarsela al "FormLogin" que es donde se encuentra el usuario.
  const isVerified = searchParams.verified == "true";

  return <FormLogin isVerified={isVerified} />;
};

export default LoginPage;
