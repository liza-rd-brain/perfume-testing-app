import { useCallback, useMemo, useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router"; // ← Убрали useLoaderData
import styles from "./style.module.css";
import { useAppData } from "~/context/AppContext"; // ← Добавили!

export const TastingList = () => {
  const navigate = useNavigate();
  const { perfumeList, savedNotes, user } = useAppData();

  if (!perfumeList || perfumeList.length === 0) {
    return null;
  }

  // ✅ Используем useCallback вместо useMemo внутри функции
  const checkIsDone = useCallback(
    (id: number) => {
      if (!Array.isArray(savedNotes)) return false;

      const note = savedNotes.find((note: any) => note?.perfume_id === id);
      return note?.isDone || false;
    },
    [savedNotes],
  );

  const notDonePerfumes = useMemo(() => {
    if (!Array.isArray(perfumeList)) return [];

    return perfumeList.filter((perfume) => !checkIsDone(perfume.id));
  }, [perfumeList, checkIsDone]);

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

  return (
    <>
      <div className={styles.container}>
        {perfumeList.map(({ id }: { id: number }) => {
          return (
            <NavLink
              key={id}
              to={checkIsDone(id) ? `/summary/${id}` : `/testing/${id}`}
              className={`${styles.testingItem} ${checkIsDone(id) ? styles.testingItemDone : ""}`}
              state={user}
            >
              {id}
            </NavLink>
          );
        })}
      </div>
      <button className={`${styles.button}`} onClick={goToRandom}>
        рандомный
      </button>
    </>
  );
};
