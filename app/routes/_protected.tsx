// app/routes/_protected.tsx
import { Outlet, redirect, useLoaderData } from "react-router";
import { getUserId, getUserById } from "~/lib/session.server";

export async function loader({ request }: any) {
  const userId = await getUserId(request);

  if (!userId) {
    return redirect("/login");
  }

  const user = await getUserById(userId);

  if (!user) {
    return redirect("/login");
  }

  return { user };
}

export default function ProtectedLayout() {
  const { user } = useLoaderData();

  return (
    <div>
      <Outlet context={{ user }} />
    </div>
  );
}
