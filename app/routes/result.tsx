// app/routes/testing.tsx
import { NavLink, useLoaderData, useLocation, useParams } from "react-router";
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
  const { perfumeList, savedNotes, user: userId, setSavedNotes } = useAppData();
  const perfumeFromState = location.state?.perfume;

  const userIdLocal = usePersistedUser(location?.state?.id);

  //TODO: helper
  const getInitialState = useMemo(() => {
    return savedNotes.find(
      ({ perfume_id }: { perfume_id: number }) => perfume_id === Number(id),
    );
  }, [savedNotes]);

  const [noteList, setNoteList] = useState<{
    top: number[];
    base: number[];
    middle: number[];
    impression: string;
    isDone: boolean;
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

  const markDone = async () => {
    try {
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

      // ✅ Обновляем только isDone у конкретной записи
      setSavedNotes(
        savedNotes.map((item: any) =>
          item.perfume_id === id
            ? { ...item, isDone: true } // ✅ Обновляем только isDone
            : item,
        ),
      );
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось сохранить");
    }
  };

  const isDone = noteList?.isDone;
  console.log({ noteList });

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

      <NavLink
        key={id}
        to={`/description/${id}`}
        className={`${commonStyles.button}`}
        state={noteList}
        onClick={markDone}
      >
        Открыть парфюм
      </NavLink>
      <p>
        ноты не перезаписать
        <br />
        но можно дополнить комментарии
      </p>
    </div>
  );
}
