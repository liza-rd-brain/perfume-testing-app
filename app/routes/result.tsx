// app/routes/testing.tsx
import { NavLink, useLoaderData, useLocation, useParams } from "react-router";
import { TastingScreen } from "~/widgets/TastingScreen/TastingItem";
import { useAppData } from "~/context/AppContext"; // ← Добавить!
import styles from "./route.module.css";
import { NoteList } from "~/components/NoteList";
import { getIntersections } from "~/helpers/getIntersections";

import { usePersistedUser } from "~/hooks/usePersistedUser";
import { useState } from "react";
import commonStyles from "../style/common.module.css";
import type { Note } from "~/types";
import { supabase } from "~/lib/supabase";

const getIdList = (array: []) => {
  return array?.map((item: { id: number }) => item.id);
};

export default function Result(props: any) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { perfumeList, savedNotes, user: userId } = useAppData();
  const perfumeFromState = location.state?.perfume;

  const userIdLocal = usePersistedUser(location?.state?.id);

  //TODO: helper
  const getInitialState = () => {
    return savedNotes.find(
      ({ perfume_id }: { perfume_id: number }) => perfume_id === Number(id),
    );
  };

  const [noteList, setNoteList] = useState<{
    top: number[];
    base: number[];
    middle: number[];
    impression: string;
  }>(getInitialState);

  const locState = location.state;

  const perfumeFromContext = perfumeList?.find((p) => p.id === Number(id));
  const perfume = perfumeFromState || perfumeFromContext;

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
  const locStateTop = locState?.top;

  const sourceNoteIdMiddle = getIdList(perfume?.notes?.middle);
  const locStateMiddle = noteList?.middle;

  const sourceNoteIdBase = getIdList(perfume?.notes?.base);
  const locStateBase = noteList?.base;

  const topIntersection = getIntersections(sourceNoteIdTop, locStateTop) || [];
  const middleIntersection =
    getIntersections(sourceNoteIdMiddle, locStateMiddle) || [];
  const baseIntersection =
    getIntersections(sourceNoteIdBase, locStateBase) || [];

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

  const markDone = async ({
    note,
    type,
    e,
  }: {
    note: Note;
    type: string;
    e: React.MouseEvent<HTMLLIElement, MouseEvent>;
  }) => {
    e.stopPropagation();

    try {
      // 1. Получаем существующую запись (если есть)
      const { data: existing } = await supabase
        .from("user_experience")
        .select("notes")
        .eq("user_id", userId)
        .eq("perfume_id", id)
        .maybeSingle();

      // 3. UPSERT - если есть - обновит, если нет - создаст
      const { error } = await supabase.from("user_experience").upsert(
        {
          user_id: userId,
          perfume_id: id,
          isDone: true,
        },
        {
          onConflict: "user_id, perfume_id", // ✅ Теперь работает!
        },
      );

      if (error) throw error;
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось сохранить");
    }
  };

  return (
    <div className={styles["main-testing"]}>
      <div>
        {" "}
        <h1 className={styles["main-header"]}> Аромат №{id}</h1>
        <p className={`${styles["main-header"]} ${styles["small-header"]}`}>
          Совпадения нот
        </p>
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

      <NavLink
        key={id}
        to={`/description/${id}`}
        className={`${commonStyles.button}`}
        state={noteList}
        onClick={() => {
          console.log("test");
        }}
      >
        Открыть парфюм
      </NavLink>
    </div>
  );
}
