// app/routes/_index.tsx
import { redirect, useLoaderData } from "react-router";
import { TastingBoard } from "../pages/TastingBoard";
import { supabaseServer } from "../lib/supabase"; // ← относительный путь
import type { Route } from "./+types/_index";
// Если getUserId и getUserById лежат в session.server.ts
import { getUserId, getUserById } from "../lib/session.server";

export async function loader({ request }: { request: Request }) {
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect("/login");
  }

  const user = await getUserById(userId);
  if (!user) {
    throw redirect("/login");
  }

  const { data: notes, error } = await supabaseServer
    .from("notes")
    .select("id, name, url")
    .order("id", { ascending: true });

  if (error) {
    return { notes: [], user, error: "Ошибка загрузки нот" };
  }

  return { notes: notes || [], user, error: null };
}

export default function Index() {
  const { notes, user, error } = useLoaderData<{
    notes: any[];
    user: any;
    error: string | null;
  }>();

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <p>Добро пожаловать, {user?.name}!</p>
      <TastingBoard notes={notes} />
    </div>
  );
}
