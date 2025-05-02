"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

const SignOutButton = () => {
  const handleClick = async () => {
    await signOut({
      redirectTo: "/login",
    });
  };

  return <Button onClick={() => handleClick()}>SignOut</Button>;
};

export default SignOutButton;
