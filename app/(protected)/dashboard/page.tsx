import { auth } from "@/auth";
import SignOutButton from "@/components/signOut-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignOutButton />
    </div>
  );
}
