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
import { usePersistedUser } from "~/hooks/usePersistedUser";
import { loadSavedNotes } from "./loadSavedNotes";
import { TastingNew } from "./TastingNew";

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

// поднять компонент или вообще разббить
// чтобы не слетали начальны ноты

export const TastingScreen = (props: any) => {
  const [noteList, setNoteList] = useState<Note[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const userIdLocal = usePersistedUser(location?.state?.id);

  const params = useParams(); // ✅ Получаем id из URL
  const perfumeId = parseInt(params.id || "0"); // ✅ ID парфюма из URL

  const userId = location?.state?.id || userIdLocal;

  // ✅ Загружаем сохраненные ноты при загрузке компонента
  useEffect(() => {
    if (userId && perfumeId) {
      loadNotes();
    }
  }, [userId, perfumeId]);

  const loadNotes = async () => {
    const savedNotes = await loadSavedNotes({ userId, perfumeId });
    setNoteList(savedNotes);
  };

  const addNewNotes = (note: any) => {
    setNoteList((prev) => [...noteList, note]);
  };

  // const loadSavedNotes = async () => {
  //   if (!userId) return;

  //   setIsLoading(true);
  //   try {
  //     const { data: userAllData, error: userAllError } = await supabase
  //       .from("user_experience")
  //       .select("*")
  //       .eq("user_id", userId);

  //     const { data, error } = await supabase
  //       .from("user_experience")
  //       .select("*")
  //       .eq("user_id", userId)
  //       .eq("perfume_id", perfumeId);

  //     debugger;

  //     // ✅ Если есть данные - берем notes
  //     if (data && data.length > 0) {
  //       const savedNotes = data
  //         .reduce((prev, item) => {
  //           return [...prev, ...(item.notes?.middle || [])];
  //         }, [])
  //         .filter(
  //           (note: { id: any }, index: any, self: any[]) =>
  //             index === self.findIndex((n) => n.id === note.id),
  //         );
  //       debugger;

  //       setNoteList(savedNotes);
  //       debugger;
  //       console.log("📝 Загружены сохраненные ноты:", { savedNotes });
  //     } else {
  //       console.log("📭 Нет сохраненных нот для этого парфюма");
  //       setNoteList([]);
  //     }
  //   } catch (error) {
  //     console.error("💥 Ошибка:", error);
  //     setNoteList([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="tasting-board">
      <div>
        <NoteList noteList={noteList} title="Выбранные ноты" />
        {/* {noteList.map((item) => (
          <span>{item.name}</span>
        ))} */}
      </div>
      <TastingNew
        noteList={noteList}
        userId={userId}
        perfumeId={perfumeId}
        addNewNotes={addNewNotes}
      />
    </div>
  );
};
