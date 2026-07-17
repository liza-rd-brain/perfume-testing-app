import { useCallback, useMemo } from "react";
import { NavLink, useNavigate, useRouteLoaderData } from "react-router";
import styles from "./style.module.css";
import { useAppData } from "~/context/AppContext";
import { AddUserButton } from "~/components/NoteList/AddUserButton";

export const TastingList = ({ perfumeList, savedNotes, user }: any) => {
  const navigate = useNavigate();

  // ✅ Создаём Set только из ID, где isDone === true
  const doneIds = useMemo(() => {
    if (!Array.isArray(savedNotes)) return new Set();

    const ids = savedNotes
      .filter((note: any) => note?.isDone === true)
      .map((note: any) => note.perfume_id);

    return new Set(ids);
  }, [savedNotes]);

  // ✅ checkIsDone - простая проверка в Set
  const checkIsDone = useCallback(
    (id: number) => {
      return doneIds.has(id);
    },
    [doneIds],
  );

  // ✅ Фильтруем неотмеченные
  const notDonePerfumes = useMemo(() => {
    if (!Array.isArray(perfumeList)) return [];
    return perfumeList.filter((perfume) => !doneIds.has(perfume.id));
  }, [perfumeList, doneIds]);

  const goToRandom = useCallback(() => {
    if (notDonePerfumes.length === 0) {
      alert("🎉 Все парфюмы уже отмечены!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * notDonePerfumes.length);
    const randomPerfume = notDonePerfumes[randomIndex];
    if (randomPerfume?.id) {
      navigate(`/testing/${randomPerfume.id}`);
    }
  }, [navigate, notDonePerfumes]);

  console.log({ perfumeList });

  if (!Array.isArray(perfumeList) || perfumeList.length === 0 || !savedNotes) {
    return <div className={styles.loading}>Загрузка парфюмов...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        {perfumeList.map((perfume) => {
          const isDone = checkIsDone(perfume.id);

          return (
            <NavLink
              key={perfume.id}
              to={isDone ? `/summary/${perfume.id}` : `/testing/${perfume.id}`}
              className={`${styles.testingItem} ${isDone ? styles.testingItemDone : ""}`}
              state={user}
            >
              {perfume.id}
            </NavLink>
          );
        })}
      </div>
      <button
        className={styles.button}
        onClick={goToRandom}
        disabled={notDonePerfumes.length === 0}
      >
        {notDonePerfumes.length === 0 ? "🎉 Всё готово!" : "🎲 Рандомный"}
      </button>
      {/* <AddUserButton /> */}
    </>
  );
};
