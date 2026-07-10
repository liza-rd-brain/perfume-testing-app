// app/routes/_index.tsx
import { redirect, useLoaderData } from "react-router";
import { supabaseAdmin } from "../lib/supabase";
import { getUserId, getUserById } from "../lib/session.server";
import { TastingList } from "~/pages/TastingList";
import { notesCache } from "~/lib/notes-cache";

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
    .select("id, name, perfumer, brand, link, notes")
    .order("id");

  if (perfumeError) {
    console.error("❌ Perfume error:", perfumeError);
  }

  return perfumeData;
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

    return {
      perfumeList: perfumeData || [],
      notes: allNotes,
      user,
      error: null,
    };
  } catch (error) {
    console.error("💥 Fatal error:", error);
    return {
      perfumeList: [],
      notes: [],
      user: null,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}

export const headers = () => ({
  "Cache-Control": "public, max-age=300",
});

export const shouldRevalidate = () => false;

export default function Index() {
  const { user, error, perfumeList, notes } = useLoaderData<{
    perfumeList: any[];
    notes: any[];
    user: any;
    error: string | null;
  }>();

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
    <div>
      <p>Добро пожаловать, {user?.name}!</p>
      <p>Загружено ароматов: {perfumeList?.length || 0}</p>
      <p>Загружено нот: {notes?.length || 0}</p>
      <TastingList />
    </div>
  );
}
