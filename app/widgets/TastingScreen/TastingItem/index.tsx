import { useEffect, useState } from "react";
import {
  useLoaderData,
  useLocation,
  useParams,
  useRouteLoaderData,
} from "react-router";
import styles from "./style.module.css";
import { NoteList } from "~/components/NoteList";
import { supabase } from "~/lib/supabase";
import { useUser } from "~/UserContext";
import { useAppData } from "~/AppContext";

interface TastingScreenProps {
  notes: Note[];
  error?: string | null;
  perfumeList: any;
}

async function getSavedNotes(userId: string, perfumeId: number) {
  const { data, error } = await supabase
    .from("user_experience")
    .select("notes")
    .eq("user_id", userId)
    .eq("perfume_id", perfumeId)
    .single(); // .single() - потому что одна запись на пользователя и парфюм

  if (error) {
    console.error("❌ Ошибка получения нот:", error);
    return null;
  }

  return data?.notes || null;
}

export const TastingScreen = (props: any) => {
  const rootData = useRouteLoaderData("root") as {
    notes?: Note[];
    perfumeList?: any[];
  } | null;

  const location = useLocation();
  console.log({ location });

  const notes = rootData?.notes || [];
  const perfumeList = rootData?.perfumeList || [];

  const [noteList, setNoteList] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams(); // ✅ Получаем id из URL
  const perfumeId = parseInt(params.id || "0"); // ✅ ID парфюма из URL
  console.log(filteredNotes);
  const userId = location.state.id;

  // ✅ Загружаем сохраненные ноты при загрузке компонента
  useEffect(() => {
    if (userId && perfumeId) {
      loadSavedNotes();
    }
  }, []);

  const loadSavedNotes = async () => {
    if (!userId) return;

    console.log("🔍 Загружаем сохраненные ноты:");
    console.log("  userId:", userId);
    console.log("  userId тип:", typeof userId);
    console.log("  userId длина:", userId?.length);
    console.log("  perfumeId:", perfumeId);
    console.log("  perfumeId тип:", typeof perfumeId);

    setIsLoading(true);
    try {
      // ✅ Сначала пробуем найти любую запись для этого пользователя
      console.log("📡 Запрос 1: Ищем все записи пользователя");
      const { data: userAllData, error: userAllError } = await supabase
        .from("user_experience")
        .select("*")
        .eq("user_id", userId);

      console.log("📦 Все записи пользователя:", userAllData);
      console.log("❌ Ошибка:", userAllError);

      // ✅ Пробуем найти запись для этого пользователя и парфюма
      console.log("📡 Запрос 2: Ищем запись для пользователя и парфюма");
      const { data, error } = await supabase
        .from("user_experience")
        .select("*")
        .eq("user_id", userId)
        .eq("perfume_id", perfumeId);

      console.log("📦 Запись для пользователя и парфюма:", data);
      console.log("❌ Ошибка:", error);

      // ✅ Если есть данные - берем notes
      if (data && data.length > 0) {
        const savedNotes = data[0].notes?.middle || [];
        setNoteList(savedNotes);
        console.log("📝 Загружены сохраненные ноты:", savedNotes);
      } else {
        console.log("📭 Нет сохраненных нот для этого парфюма");
        setNoteList([]);
      }
    } catch (error) {
      console.error("💥 Ошибка:", error);
      setNoteList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async (note: Note) => {
    if (noteList.some((n) => n.id === note.id)) {
      console.log("Эта нота уже добавлена");
      return;
    }

    console.log({ userId });

    try {
      const { data, error } = await supabase.from("user_experience").insert([
        {
          user_id: userId,
          perfume_id: 1, // ID текущего парфюма
          notes: { middle: [...noteList, note] },
        },
      ]);

      if (error) {
        console.error("Ошибка Supabase:", error);
        console.log("Ошибка при сохранении");
      } else {
        console.log("Впечатления сохранены!");
        setNoteList([]); // Очищаем список
      }
    } catch (error) {
      console.error("Ошибка:", error);
      console.log("Не удалось сохранить");
    }
    setNoteList((prev) => [...prev, note]);
    setSearchTerm("");
    setFilteredNotes([]);
  };

  // console.log({ notes, perfumeList });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredNotes([]);
      return;
    }

    const results = notes?.filter((note) =>
      note.name.toLowerCase().includes(value.trim().toLowerCase()),
    );
    setFilteredNotes(results);
  };

  // if (error) {
  //   return <div className="error-message">Ошибка: {error}</div>;
  // }

  return (
    <div className="tasting-board">
      {/* <h1>Дегустационная доска</h1>
      <p>Всего нот: {notes?.length || 0}</p> */}
      <span>Выбранные ноты</span>
      <div>
        <NoteList noteList={noteList} title="Верхние ноты" />
        {noteList.map((item) => (
          <span>{item.name}</span>
        ))}
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск по нотам..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="results-container">
        {searchTerm.trim() && filteredNotes.length === 0 && (
          <p className="no-results">Ничего не найдено</p>
        )}

        {filteredNotes.length > 0 && (
          <ul className="notes-list">
            {filteredNotes.map((note) => {
              // console.log({ note });

              return (
                <li
                  key={note.id}
                  className={styles["note-item"]}
                  onClick={() => addNote(note)}
                >
                  <span className="note-name">{note.name}</span>
                  {note.image && (
                    <img
                      src={note.image}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
