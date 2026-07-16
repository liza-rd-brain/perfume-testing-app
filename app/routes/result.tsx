// app/routes/testing.tsx
import { useLoaderData, useLocation, useParams } from "react-router";
import { TastingScreen } from "~/widgets/TastingScreen/TastingItem";
import { useAppData } from "~/context/AppContext"; // ← Добавить!
import styles from "./route.module.css";
import { NoteList } from "~/components/NoteList";

export default function Result(props: any) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const locState = location.state;

  // Получаем данные из контекста (запасной вариант)
  const { perfumeList } = useAppData();

  // 1. Сначала из state (переданные через NavLink)
  const perfumeFromState = location.state?.perfume;

  //  2. Если нет в state - ищем в контексте
  const perfumeFromContext = perfumeList?.find((p) => p.id === Number(id));

  // ✅ 3. Используем то, что нашли
  const perfume = perfumeFromState || perfumeFromContext;

  console.log({ locState, perfumenotes: perfume.notes, perfume });

  if (!perfume) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Аромат не найден</h2>
        <p>ID: {id}</p>
        <button onClick={() => window.history.back()}>Назад</button>
      </div>
    );
  }

  const sourceNoteIdTop = perfume?.notes?.top?.map(
    (item: { id: number }) => item.id,
  );
  const locStateTop = locState?.top;

  const sourceNoteIdMiddle = perfume?.notes?.middle?.map(
    (item: { id: number }) => item.id,
  );
  const locStateMiddle = locState?.middle;

  const sourceNoteIdTopSet = new Set(sourceNoteIdTop);
  const locStateTopSet = new Set(locStateTop);

  const sourceNoteIdMiddleSet = new Set<number>(sourceNoteIdMiddle);
  const locStateMiddleSet = new Set<number>(locStateMiddle);

  const middleIntersection =
    sourceNoteIdMiddleSet.intersection(locStateMiddleSet);

  console.log({
    middleIntersection,
  });

  return (
    <div className={styles["main-testing"]}>
      <h1 className={styles["main-header"]}> Аромат №{id}</h1>
      <h2 className={styles["main-header"]}> Угадано нот</h2>

      {perfume?.notes?.top && (
        <NoteList noteList={locState?.top} title="Верхние ноты" />
      )}
      <NoteList
        noteList={Array.from(middleIntersection)}
        title={
          !perfume.notes.top && !perfume.notes.base
            ? "Общие ноты"
            : "Средние ноты"
        }
      />
      {perfume.notes.base && (
        <NoteList noteList={perfume.notes.base} title="Базовые ноты" />
      )}

      {/* ✅ Передаем данные в TastingScreen */}
    </div>
  );
}
