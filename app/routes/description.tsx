// app/routes/testing.tsx
import { NavLink, useLoaderData, useLocation, useParams } from "react-router";
import { TastingScreen } from "~/widgets/TastingScreen/TastingItem";
import { useAppData } from "~/context/AppContext"; // ← Добавить!
import styles from "./route.module.css";
import { NoteList } from "~/components/NoteList";

import { ToIndexButton } from "~/components/NoteList/ToIndexButton";

export default function Result(props: any) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  console.log({ props });

  // ✅ Получаем данные из контекста (запасной вариант)
  const { perfumeList, notes, user } = useAppData();

  // ✅ 1. Сначала из state (переданные через NavLink)
  const perfumeFromState = location.state?.perfume;

  // ✅ 2. Если нет в state - ищем в контексте
  const perfumeFromContext = perfumeList?.find((p) => p.id === Number(id));

  // ✅ 3. Используем то, что нашли
  const perfume = perfumeFromState || perfumeFromContext;

  console.log({
    locationState: location.state,
    perfumeFromState,
    perfumeFromContext,
    finalPerfume: perfume,
    id,
  });

  if (!perfume) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Аромат не найден</h2>
        <p>ID: {id}</p>
        <button onClick={() => window.history.back()}>Назад</button>
      </div>
    );
  }

  return (
    <div className={styles["main-testing"]}>
      <div className={styles["header-container"]}>
        <h1 className={styles["main-header"]}> Аромат №{id}</h1>
        <ToIndexButton />
        {/* <ForwardButton /> */}
      </div>
      <div className={styles["about-container"]}>
        <img
          className={styles["perfume-img"]}
          src={perfume.image}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className={styles["about-text"]}>
          <p>
            <strong>Название:</strong>
          </p>
          {perfume.name}
          {perfume.perfumer && (
            <p>
              <strong>Парфюмер:</strong>
            </p>
          )}
          {perfume.brand}
          <p>
            <strong>Бренд:</strong>
          </p>
          {perfume.brand}

          {perfume.link && (
            <a
              href={perfume.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["perfume-link"]}
            >
              ссылка на парфюм
            </a>
          )}
        </div>
      </div>
      {perfume.notes.top && (
        <NoteList noteList={perfume.notes.top} title="Верхние ноты" />
      )}
      <NoteList
        noteList={perfume.notes.middle}
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
