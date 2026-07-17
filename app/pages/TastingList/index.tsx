import { useCallback, useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router"; // ← Убрали useLoaderData
import styles from "./style.module.css";
import { useAppData } from "~/context/AppContext"; // ← Добавили!

export const TastingList = ({ user }: any) => {
  const navigate = useNavigate();
  const { perfumeList, savedNotes, ...rest } = useAppData();

  debugger;
  if (!perfumeList || perfumeList.length === 0) {
    return null;
  }

  console.log({ savedNotes });

  const goToRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * perfumeList.length);
    const randomPerfume = perfumeList[randomIndex];
    if (randomPerfume?.id) {
      navigate(`/testing/${randomPerfume.id}`);
    }
  }, [navigate, perfumeList]); // ✅ Зависимости явно указаны

  const checkIsDone = (id: number) => {
    debugger;
    const isDone = savedNotes.find(
      (note: any) => note.perfume_id === id,
    )?.isDone;
    console.log({ isDone });
    return isDone || false;
  };

  return (
    <>
      <div className={styles.container}>
        {perfumeList.map(({ id }: { id: number }) => {
          return (
            <NavLink
              key={id}
              // ✅ Убрали двоеточие!
              to={checkIsDone(id) ? `/description/${id}` : `/testing/${id}`}
              className={styles.testingItem}
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
