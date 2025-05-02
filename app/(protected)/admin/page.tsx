import { auth } from "@/auth";
import SignOutButton from "@/components/signOut-button";
import React from "react";

const AdminPage = async () => {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return <div>You are not admin</div>;
  }

  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
};

export default AdminPage;
