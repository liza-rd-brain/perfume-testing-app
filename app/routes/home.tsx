import { useLoaderData } from "react-router";
import { supabase } from "../lib/supabase";
import { TastingBoard } from "../pages/TastingBoard";

// 📦 Загружаем ноты на сервере
export async function loader() {
  try {
    console.log("🔄 Сервер: загрузка нот...");

    const { data, error } = await supabase
      .from("notes")
      .select("id, name, url")
      .order("id", { ascending: true });

    if (error) throw error;

    return {
      notes: data || [],
      error: null,
    };
  } catch (err) {
    console.error("❌ Сервер: ошибка загрузки нот:", err);
    return {
      notes: [],
      error: err instanceof Error ? err.message : "Ошибка загрузки нот",
    };
  }
}

export default function Home() {
  const { notes, error } = useLoaderData<{
    notes: any[];
    error: string | null;
  }>();

  return <TastingBoard notes={notes} error={error} />;
}
