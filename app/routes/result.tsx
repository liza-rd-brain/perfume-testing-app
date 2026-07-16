// app/routes/testing.tsx
import { useLoaderData, useLocation, useParams } from "react-router";
import { TastingScreen } from "~/widgets/TastingScreen/TastingItem";
import { useAppData } from "~/context/AppContext"; // ← Добавить!
import styles from "./route.module.css";
import { NoteList } from "~/components/NoteList";
import { getIntersections } from "~/helpers/getIntersections";

import { usePersistedUser } from "~/hooks/usePersistedUser";
import { useState } from "react";

const getIdList = (array: []) => {
  return array?.map((item: { id: number }) => item.id);
};

export default function Result(props: any) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { perfumeList, savedNotes } = useAppData();
  const perfumeFromState = location.state?.perfume;

  const userIdLocal = usePersistedUser(location?.state?.id);
  const userId = location?.state?.id || userIdLocal;

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

  console.log({
    middleIntersection,
    sourceNoteIdMiddle,
    locStateMiddle,
  });

  return (
    <div className={styles["main-testing"]}>
      <h1 className={styles["main-header"]}> Аромат №{id}</h1>
      <h2 className={styles["main-header"]}> Угадано нот</h2>

      {perfume?.notes?.top && (
        <NoteList noteList={topIntersection} title="Верхние ноты" />
      )}
      <NoteList
        noteList={middleIntersection}
        title={
          !perfume.notes.top && !perfume.notes.base
            ? "Общие ноты"
            : "Средние ноты"
        }
      />
      {perfume.notes.base && (
        <NoteList noteList={baseIntersection} title="Базовые ноты" />
      )}

      {/* ✅ Передаем данные в TastingScreen */}
    </div>
  );
}
