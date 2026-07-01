// app/routes/home.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🚀 Home компонент загружен");

    const supabase = createClient(
      "https://lqqinaarpvexvlkkjyyu.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcWluYWFycHZleHZsa2tqeXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5Mjc0MzQsImV4cCI6MjA5ODUwMzQzNH0.KC-TC4HX8GSvZlDcVFQlmGnxWpn2FreRbbP3nK1Hzl8",
    );

    async function fetchNotes() {
      try {
        console.log("🔄 Запрос к Supabase...");
        const { data, error } = await supabase.from("notes").select("*");
        console.log("📦 Ответ:", { data, error });

        if (error) {
          setError(error.message);
        } else {
          setNotes(data || []);
        }
      } catch (err) {
        console.error("🔥 Ошибка:", err);
        setError(err instanceof Error ? err.message : "Ошибка");
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  if (loading)
    return <div style={{ padding: "20px" }}>⏳ Загрузка заметок...</div>;
  if (error)
    return (
      <div style={{ color: "red", padding: "20px" }}>❌ Ошибка: {error}</div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h1>📝 Заметки</h1>
      <p>Всего: {notes.length}</p>
      <ul>
        {notes.map((note, i) => (
          <li key={note.id || i}>{note.name || JSON.stringify(note)}</li>
        ))}
      </ul>
    </div>
  );
}
