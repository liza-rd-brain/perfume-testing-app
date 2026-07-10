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
import { Base, type Note } from "~/types";

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
  const rootData = useRouteLoaderData("root") as {
    notes?: Note[];
    perfumeList?: any[];
  } | null;
  const notes = rootData?.notes || [];

  const [noteList, setNoteList] = useState<{
    top: number[];
    base: number[];
    middle: [];
  }>({ top: [], base: [], middle: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeType, setActiveType] = useState(Base.TOP);

  const location = useLocation();
  const userIdLocal = usePersistedUser(location?.state?.id);

  const params = useParams(); // ✅ Получаем id из URL
  const perfumeId = parseInt(params.id || "0"); // ✅ ID парфюма из URL

  const userId = location?.state?.id || userIdLocal;

  // ✅ Загружаем сохраненные ноты при загрузке компонента
  useEffect(() => {
    if (userId && perfumeId) {
      console.log("useEffect");
      loadNotes();
    }
  }, []);

  const loadNotes = async () => {
    const savedNotes = await loadSavedNotes({ userId, perfumeId });
    console.log({ savedNotes });
    setNoteList({
      top: savedNotes?.top || [],
      base: savedNotes?.base || [],
      middle: savedNotes?.middle || [],
    });
  };

  const addNewNotes = ({ id, type }: { id: number; type: Base }) => {
    debugger;
    setNoteList((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), id],
    }));
  };

  const changeActiveType = (type: Base) => {
    setActiveType(type);
  };

  const removeNote = async ({
    noteId,
    type,
  }: {
    noteId: number;
    type: Base;
  }) => {
    try {
      // 1. Получаем существующую запись
      const { data: existing } = await supabase
        .from("user_experience")
        .select("notes")
        .eq("user_id", userId)
        .eq("perfume_id", perfumeId)
        .maybeSingle();

      if (!existing) {
        console.log("Запись не найдена");
        return;
      }
      debugger;
      // 2. Удаляем note.id из массива
      const currentNotes = existing.notes || {};
      const updatedNotes = {
        ...currentNotes,
        [type]: currentNotes[type]?.filter((id: number) => id !== noteId) || [],
      };

    

      // 4. Если объект notes стал пустым - удаляем всю запись?
      if (Object.keys(updatedNotes).length === 0) {
        // Вариант А: Удалить всю запись
        const { error } = await supabase
          .from("user_experience")
          .delete()
          .eq("user_id", userId)
          .eq("perfume_id", perfumeId);

        if (error) throw error;

        console.log("✅ Запись полностью удалена");
      } else {
        // Вариант Б: Обновить с удаленной нотой
        const { error } = await supabase
          .from("user_experience")
          .update({ notes: updatedNotes })
          .eq("user_id", userId)
          .eq("perfume_id", perfumeId);

        debugger;

        setNoteList((prev) => ({
          ...prev,
          [type]: prev[type]?.filter((id: number) => id !== noteId) || [],
        }));

        if (error) throw error;

        console.log("✅ Нота удалена");
      }

      // // 5. Обновляем локальное состояние
      // removeLocalNote({ id: noteId, type });
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось удалить ноту");
    }
  };

  console.log({ activeType });

  const handleRemove = (type: Base) => (noteId: number) => {
    removeNote({ noteId, type });
  };
return (
    <div className={styles["tasting-board"]}>
      <div
        className={`
        ${activeType === Base.TOP ? styles["tasting-type"] : undefined} 
        ${styles["tasting-container"]}`}
      >
        <NoteList
          // type={Base.TOP}
          noteList={noteList.top}
          title="Верхние ноты"
          removeNote={handleRemove(Base.TOP)}
        />
        <TastingNew
          activeType={activeType}
          type={Base.TOP}
          noteList={noteList}
          userId={userId}
          perfumeId={perfumeId}
          notes={notes}
          addNewNotes={addNewNotes}
          changeActiveType={changeActiveType}
        />
      </div>
      <div
        className={`${activeType === Base.MIDDLE ? styles["tasting-type"] : undefined}`}
      >
        <NoteList
          // type={Base.MIDDLE}
          noteList={noteList.middle}
          title="Средние ноты"
          removeNote={handleRemove(Base.MIDDLE)}
        />
        <TastingNew
          activeType={activeType}
          type={Base.MIDDLE}
          noteList={noteList}
          userId={userId}
          perfumeId={perfumeId}
          notes={notes}
          addNewNotes={addNewNotes}
          changeActiveType={changeActiveType}
        />
      </div>
      <div
        className={`${activeType === Base.BASE ? styles["tasting-type"] : undefined}`}
      >
        <NoteList
          // type={Base.BASE}
          noteList={noteList.base}
          title="Базовые ноты"
          removeNote={handleRemove(Base.BASE)}
        />
        <TastingNew
          activeType={activeType}
          type={Base.BASE}
          noteList={noteList}
          userId={userId}
          perfumeId={perfumeId}
          notes={notes}
          addNewNotes={addNewNotes}
          changeActiveType={changeActiveType}
        />
      </div>
      {/* {noteList.map((item) => (
          <span>{item.name}</span>
        ))} */}
    </div>
  );
};
