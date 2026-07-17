import { redirect, useLoaderData } from "react-router";
import { supabaseAdmin } from "../lib/supabase";
import { getUserId, getUserById } from "../lib/session.server";
import { TastingList } from "~/pages/TastingList";
import { notesCache } from "~/lib/notes-cache";

import styles from "./route.module.css";
import { loadAllSavedNotes } from "~/widgets/TastingScreen/TastingItem/loadAllSavedNotes";

// ✅ Функция для загрузки всех нот с пагинацией
export async function getAllNotes() {
  const cacheKey = "all-notes";

  // Проверяем кеш
  const cached = notesCache.get(cacheKey);
  if (cached) {
    console.log("✅ Using cached notes:", cached.length);
    return cached;
  }

  console.log("🔄 Fetching all notes from database...");

  let allNotes: any[] = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    try {
      const { data, error } = await supabaseAdmin
        .from("notes")
        .select("id, name, image")
        .order("id", { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error(`❌ Error fetching notes at offset ${from}:`, error);
        break;
      }

      if (!data || data.length === 0) {
        console.log(`✅ No more notes at offset ${from}`);
        break;
      }

      allNotes = [...allNotes, ...data];
      console.log(`📊 Loaded ${allNotes.length} notes so far...`);

      if (data.length < pageSize) {
        console.log(`✅ Last batch: got ${data.length} notes`);
        break;
      }

      from += pageSize;
    } catch (error) {
      console.error(`💥 Error fetching notes at offset ${from}:`, error);
      break;
    }
  }

  // Сохраняем в кеш
  notesCache.set(cacheKey, allNotes);
  console.log(`✅ Total notes loaded: ${allNotes.length} (cached)`);

  return allNotes;
}

export async function getPerfumeList() {
  // Загружаем perfume-set-1
  const { data: perfumeData, error: perfumeError } = await supabaseAdmin
    .from("perfume-set-1")
    .select("id, name, perfumer, brand, link, notes, image")
    .order("id");

  if (perfumeError) {
    console.error("❌ Perfume error:", perfumeError);
  }

  return perfumeData || [];
}

export async function loader({ request }: { request: Request }) {
  console.log("🚀 Loader started");

  try {
    // Проверяем авторизацию
    const userId = await getUserId(request);
    if (!userId) {
      return redirect("/login");
    }

    const user = await getUserById(userId);
    if (!user) {
      return redirect("/login");
    }

    // Загружаем все ноты
    const allNotes = await getAllNotes();

    const perfumeData = await getPerfumeList();

    const savedNotes = await loadAllSavedNotes(Number(userId));

    // ✅ Всегда возвращаем массивы
    return {
      perfumeList: perfumeData || [],
      notes: allNotes || [],
      user,
      savedNotes: savedNotes || [],
      error: null,
    };
  } catch (error) {
    console.error("💥 Fatal error:", error);
    return {
      perfumeList: [],
      notes: [],
      user: null,
      savedNotes: [],
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}

export const headers = () => ({
  "Cache-Control": "public, max-age=300",
});

export const shouldRevalidate = () => false;

// ✅ Типизация для useLoaderData
type LoaderData = {
  perfumeList: any[];
  notes: any[];
  user: any;
  error: string | null;
  savedNotes: any[]; // ✅ Добавляем
};

export default function Index() {
  const { user, error, perfumeList, notes, savedNotes } =
    useLoaderData<LoaderData>(); // ✅ Используем типизацию

  // ✅ Отладка
  console.log("📊 Index - perfumeList:", perfumeList?.length);
  console.log("📊 Index - notes:", notes?.length);
  console.log("📊 Index - savedNotes:", savedNotes?.length);

  if (error) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ color: "red" }}>⚠️ Ошибка загрузки</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className={styles["page-layout"]}>
      <p>Список пробников</p>
      {/* ✅ Передаём savedNotes в TastingList */}
      <TastingList />
    </div>
  );
}
