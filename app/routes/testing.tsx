// app/routes/testing.tsx
import { useLoaderData, useLocation, useParams } from "react-router";
import { TastingScreen } from "~/widgets/TastingScreen/TastingItem";
import { useAppData } from "~/context/AppContext";
import styles from "./route.module.css";
import { BackButton } from "~/components/NoteList/BackButton";
import { useMemo } from "react";

export default function Testing() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // ✅ Получаем данные из контекста
  const { perfumeList, savedNotes, user } = useAppData();

  // ✅ 1. Сначала из state (переданные через NavLink)
  const perfumeFromState = location.state?.perfume;

  // ✅ 2. Если нет в state - ищем в контексте
  const perfumeFromContext = perfumeList?.find((p) => p.id === Number(id));

  // ✅ 3. Используем то, что нашли
  const perfume = perfumeFromState || perfumeFromContext;

  // ✅ 4. Проверка isDone (БЕЗ useMemo внутри функции!)
  const checkIsDone = (id: number) => {
    if (!Array.isArray(savedNotes)) return false;
    const note = savedNotes.find((note) => note?.perfume_id === id);
    return note?.isDone || false;
  };

  // ✅ 5. Вычисляем isDone через useMemo на верхнем уровне
  const isDone = useMemo(() => {
    if (!id) return false;
    return checkIsDone(Number(id));
  }, [savedNotes, id]);

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
        <BackButton />
        <h1> Аромат №{id}</h1>
      </div>
      <TastingScreen />
    </div>
  );
}
