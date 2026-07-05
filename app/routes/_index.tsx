// app/routes/_index.tsx
import { redirect, useLoaderData } from "react-router";
import { TastingItem } from "../widgets/TastingItem";
import { supabaseServer } from "../lib/supabase"; // ← относительный путь
import type { Route } from "./+types/_index";
// Если getUserId и getUserById лежат в session.server.ts
import { getUserId, getUserById } from "../lib/session.server";
import { TastingList } from "~/pages/TastingList";

export async function loader({ request }: { request: Request }) {
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect("/login");
  }

  const user = await getUserById(userId);
  if (!user) {
    throw redirect("/login");
  }

  try {
    let allNotes: any[] = [];
    let from = 0;
    const pageSize = 100; // Загружаем по 1000 за раз

    let perfumeList = [];

    while (true) {
      const { data, error } = await supabaseServer
        .from("notes")
        .select("id, name, url, image")
        .order("id", { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        break;
      }

      allNotes = [...allNotes, ...data];

      // Если получили меньше, чем запросили - значит это последняя страница
      if (data.length < pageSize) {
        break;
      }

      from += pageSize;
    }

    const { data, error, status } = await supabaseServer
      .from("perfume-set-1")
      .select("id, name, perfumer, brand, link, notes")
      .order("id");

    console.log({ data, error, status });

    return {
      notes: allNotes,
      user,
      error: null,
      total: allNotes.length,
      perfumeList: data,
    };
  } catch (error) {
    console.error("Error loading notes:", error);
    return {
      notes: [],
      user,
      error: "Ошибка загрузки нот. Пожалуйста, попробуйте позже.",
    };
  }
}

export default function Index() {
  const { user, error } = useLoaderData<{
    notes: any[];
    user: any;
    error: string | null;
    perfumeList: any[];
  }>();

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <p>Добро пожаловать, {user?.name}!</p>
      <TastingList />
    </div>
  );
}
