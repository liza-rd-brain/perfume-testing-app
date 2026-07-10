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
import type { Base, Note } from "~/types";

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

  const addNewNotes = ({ note, type }: { note: any; type: Base }) => {
    debugger;
    setNoteList((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), note],
    }));
  };
  return (
    <div className="tasting-board">
      <div>
        <NoteList
          // type={Base.TOP}
          noteList={noteList.top}
          title="Выбранные ноты верх"
        />
        <NoteList
          // type={Base.MIDDLE}
          noteList={noteList.middle}
          title="Выбранные ноты середина"
        />
        <NoteList
          // type={Base.BASE}
          noteList={noteList.base}
          title="Выбранные ноты база"
        />
        {/* {noteList.map((item) => (
          <span>{item.name}</span>
        ))} */}
      </div>
      <TastingNew
        noteList={noteList}
        userId={userId}
        perfumeId={perfumeId}
        notes={notes}
        addNewNotes={addNewNotes}
      />
    </div>
  );
};
