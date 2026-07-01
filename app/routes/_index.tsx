// app/routes/_index.tsx
import { useLoaderData } from "react-router";
import { supabase } from "./../lib/supabase";

// 📦 Функция для загрузки ВСЕХ записей с пагинацией
async function fetchAllNotes() {
  const allNotes: any[] = [];
  let page = 0;
  const pageSize = 1000; // Максимум за один запрос

  while (true) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .range(from, to)
      .order("id", { ascending: true });

    if (error) {
      console.error("❌ Ошибка:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      break;
    }

    allNotes.push(...data);

    if (data.length < pageSize) {
      break;
    }

    page++;
  }

  return allNotes;
}

// 🔥 Loader на сервере
export async function loader() {
  try {
    const notes = await fetchAllNotes();
    return { notes, error: null };
  } catch (err) {
    console.error("❌ Ошибка:", err);
    return {
      notes: [],
      error: err instanceof Error ? err.message : "Ошибка загрузки",
    };
  }
}

// 🖥️ Компонент
export default function Index() {
  const { notes, error } = useLoaderData<typeof loader>();

  if (error) {
    return <div style={{ color: "red", padding: "20px" }}>❌ {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>📝 Заметки ({notes.length})</h1>
      <ul>
        {notes.map((note) => (
          <>
            <li key={note.id}>{note.name}</li>
            <li key={note.id}>
              <img src={note.image} referrerPolicy="no-referrer" />
            </li>
          </>
        ))}
      </ul>
    </div>
  );
}
