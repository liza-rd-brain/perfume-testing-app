import { useCallback, useMemo, useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router"; // ← Убрали useLoaderData
import styles from "./style.module.css";
import { useAppData } from "~/context/AppContext"; // ← Добавили!

export const TastingList = ({ user }: any) => {
  const navigate = useNavigate();
  const { perfumeList, savedNotes, ...rest } = useAppData();

  if (!perfumeList || perfumeList.length === 0) {
    return null;
  }

  const goToRandom = useCallback(() => {
    const notDonePerfumes = perfumeList.filter((perfume) => {
      const savedNote = savedNotes?.find(
        (note: any) => note.perfume_id === perfume.id,
      );
      return !savedNote?.isDone; // true, если isDone === false или undefined
    });
    const randomIndex = Math.floor(Math.random() * notDonePerfumes.length);
    const randomPerfume = notDonePerfumes[randomIndex];
    if (randomPerfume?.id) {
      navigate(`/testing/${randomPerfume.id}`);
    }
  }, [navigate, perfumeList]);

  const checkIsDone = (id: number) => {
    const isDone = useMemo(
      () => savedNotes.find((note: any) => note.perfume_id === id)?.isDone,
      [id],
    );

    return isDone || false;
  };

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
