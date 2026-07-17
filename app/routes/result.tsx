// app/routes/testing.tsx
import {
  NavLink,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import { TastingScreen } from "~/widgets/TastingScreen/TastingItem";
import { useAppData } from "~/context/AppContext"; // ← Добавить!
import styles from "./route.module.css";
import { NoteList } from "~/components/NoteList";
import { getIntersections } from "~/helpers/getIntersections";

import { usePersistedUser } from "~/hooks/usePersistedUser";
import { useMemo, useState } from "react";
import commonStyles from "../style/common.module.css";
import type { Note } from "~/types";
import { supabase } from "~/lib/supabase";
import { BackButton } from "~/components/NoteList/BackButton";

const getIdList = (array: []) => {
  return array?.map((item: { id: number }) => item.id);
};

export default function Result(props: any) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { perfumeList, user: userId, setSavedNotes } = useAppData();

  const navigate = useNavigate();

  const selectedNotes = location.state;

  //TODO: helper

  const [noteList, setNoteList] = useState<{
    top: number[];
    base: number[];
    middle: number[];
    impression: string;
    isDone: boolean;
  }>(selectedNotes);

  const perfumeFromContext = perfumeList?.find((p) => p.id === Number(id));
  const perfume = perfumeFromContext;

  if (!perfume) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Аромат не найден</h2>
        <p>ID: {id}</p>
        <button onClick={() => window.history.back()}>Назад</button>
      </div>
    );
  }

  const sourceNoteIdTop = getIdList(perfume?.notes?.top);
  const selectedNotesTop = selectedNotes?.top;

  const sourceNoteIdMiddle = getIdList(perfume?.notes?.middle);
  const selectedNotesMiddle = noteList?.middle;

  const sourceNoteIdBase = getIdList(perfume?.notes?.base);
  const selectedNotesBase = noteList?.base;

  const topIntersection =
    getIntersections(sourceNoteIdTop, selectedNotesTop) || [];

  const middleIntersection =
    getIntersections(sourceNoteIdMiddle, selectedNotesMiddle) || [];
  const baseIntersection =
    getIntersections(sourceNoteIdBase, selectedNotesBase) || [];

  const noteSumm = [
    ...(topIntersection || []),
    ...middleIntersection,
    ...(baseIntersection || []),
  ].length;

  const sourceNoteSumm = [
    ...(sourceNoteIdTop || []),
    ...sourceNoteIdMiddle,
    ...(sourceNoteIdBase || []),
  ].length;

  const markDone = async () => {
    try {
      // 1. Сохраняем в БД
      const { error } = await supabase.from("user-experience").upsert(
        {
          user_id: userId,
          perfume_id: id,
          isDone: true,
        },
        {
          onConflict: "user_id, perfume_id",
        },
      );

      if (error) throw error;

      // ✅ 2. Запрашиваем свежий список из БД
      const { data: freshSavedNotes, error: fetchError } = await supabase
        .from("user-experience")
        .select("*")
        .eq("user_id", userId);

      if (fetchError) throw fetchError;

      // ✅ 3. Обновляем контекст свежими данными
      if (freshSavedNotes) {
        setSavedNotes(freshSavedNotes);
      }

      // И сразу после проверь

      // 4. Переходим на страницу с описанием
      navigate(`/description/${id}`);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось сохранить");
    }
  };

  const isDone = noteList?.isDone;

  return (
    <div className={styles["main-testing"]}>
      <div className={styles["header-container"]}>
        {!isDone && <BackButton />}
        <h1> Аромат №{id}</h1>
      </div>
      <div>
        <p className={` ${styles["small-header"]}`}>Совпадения нот</p>
        <p className={styles["main-comment"]}>
          (учитываются только точные совпадения)
        </p>
      </div>

      {!!perfume?.notes?.top && !!topIntersection.length && (
        <NoteList noteList={topIntersection} title="Верхние ноты" />
      )}
      {!!middleIntersection.length && (
        <NoteList
          noteList={middleIntersection}
          title={
            !perfume.notes.top && !perfume.notes.base
              ? "Общие ноты"
              : "Средние ноты"
          }
        />
      )}
      {perfume.notes?.base && !!baseIntersection.length && (
        <NoteList noteList={baseIntersection} title="Базовые ноты" />
      )}
      {noteSumm >= 4 && (
        <div>
          💫 Отгадано {noteSumm} нот из {sourceNoteSumm}!
          <br /> Потрясающий результат!
        </div>
      )}
      {noteSumm === 3 && (
        <div>
          🌟 {noteSumm} ноты! из {sourceNoteSumm}
          <br />
          Отгаданы главные аккорды?
        </div>
      )}
      {noteSumm === 2 && (
        <div>
          ✨ {noteSumm} ноты из {sourceNoteSumm}!
          <br /> Ты на верном пути!
        </div>
      )}
      {noteSumm === 1 && (
        <div>
          🌿 {noteSumm} нота из {sourceNoteSumm}!
          <br />
          Ты начинаешь видеть картину аромата
        </div>
      )}
      {noteSumm === 0 && (
        <div>
          🌀0 нот из {sourceNoteSumm}. Хитрый парфюм!
          <br /> Пора узнать что это такое!
        </div>
      )}

      <button key={id} className={`${commonStyles.button}`} onClick={markDone}>
        Открыть парфюм
      </button>
      <p>изменить первое впечатление уже нельзя </p>
    </div>
  );
}
