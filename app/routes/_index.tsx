// app/routes/_index.tsx
import { useLoaderData } from "react-router";
import { supabase } from "./../lib/supabase";

// 🔥 1. Загружаем данные на сервере
export async function loader() {
  const { data, error } = await supabase.from("notes").select("*").limit(2000);

  if (error) {
    return { notes: [], error: error.message };
  }

  return { notes: data || [], error: null };
}

// 🖥️ 2. Получаем данные на клиенте
export default function Index() {
  const { notes, error } = useLoaderData<typeof loader>();

  if (error) return <div>❌ {error}</div>;

  return (
    <div>
      <h1>Заметки ({notes.length})</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.name}</li>
        ))}
      </ul>
    </div>
  );
}
