// app/routes/testing.tsx
import { useLoaderData, useLocation, useParams } from "react-router";
import { TastingScreen } from "~/widgets/TastingScreen/TastingItem";
import { useAppData } from "~/context/AppContext"; // ← Добавить!
import styles from "./route.module.css";
import { BackButton } from "~/components/NoteList/BackButton";

export default function Testing(props: any) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  console.log({ props });

  // ✅ Получаем данные из контекста (запасной вариант)
  const { perfumeList } = useAppData();

  // ✅ 1. Сначала из state (переданные через NavLink)
  const perfumeFromState = location.state?.perfume;

  // ✅ 2. Если нет в state - ищем в контексте
  const perfumeFromContext = perfumeList?.find((p) => p.id === Number(id));

  // ✅ 3. Используем то, что нашли
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
