import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Note = {
  id?: number;
  name: string;
  title?: string;
  [key: string]: any;
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🚀 1. КОМПОНЕНТ ЗАГРУЖЕН!");

    // ВАШ РЕАЛЬНЫЙ КЛЮЧ УЖЕ ЗДЕСЬ!
    const supabaseUrl = "https://lqqinaarpvexvlkkjyyu.supabase.co";
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcWluYWFycHZleHZsa2tqeXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5Mjc0MzQsImV4cCI6MjA5ODUwMzQzNH0.KC-TC4HX8GSvZlDcVFQlmGnxWpn2FreRbbP3nK1Hzl8";

    console.log("📌 2. URL:", supabaseUrl);
    console.log(
      "📌 3. KEY:",
      supabaseKey ? `Длина: ${supabaseKey.length} символов` : "ОТСУТСТВУЕТ",
    );
    console.log("📌 4. Начало ключа:", supabaseKey?.substring(0, 30) + "...");

    // Убираем проверку на "ваш_ключ_здесь"
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ 5. Ключи отсутствуют!");
      setError("Ключи не найдены!");
      setLoading(false);
      return;
    }

    console.log("✅ 6. Создаю клиент...");
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ 7. Клиент создан!");

    async function fetchData() {
      console.log("🔄 8. Запрос к таблице 'notes'...");

      try {
        const result = await supabase.from("notes").select("*");
        console.log("📦 9. РЕЗУЛЬТАТ ПОЛУЧЕН!");
        console.log("📊 10. data:", result.data);
        console.log("❌ 11. error:", result.error);

        if (result.error) {
          console.error("❌ 12. Ошибка:", result.error);
          setError(`Ошибка: ${result.error.message}`);
        } else {
          console.log(`✅ 13. УСПЕХ! ${result.data?.length || 0} записей`);
          console.log("📝 14. Данные:", result.data);
          setNotes(result.data || []);
        }
      } catch (err) {
        console.error("🔥 15. Критическая ошибка:", err);
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      } finally {
        console.log("🏁 16. Запрос завершен");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>⏳ Загрузка...</h3>
        <p>Проверьте консоль (F12)</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", padding: "20px" }}>
        <h3>❌ Ошибка</h3>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📝 Заметки ({notes.length})</h2>
      {notes.length === 0 ? (
        <p>📭 Нет заметок</p>
      ) : (
        <ul>
          {notes.map((note, i) => (
            <li key={note.id || i} style={{ padding: "5px 0" }}>
              {note.name || note.title || JSON.stringify(note)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
