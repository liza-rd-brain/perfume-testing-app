import { useCallback, useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router"; // ← Убрали useLoaderData
import styles from "./style.module.css";
import { useAppData } from "~/context/AppContext"; // ← Добавили!

export const TastingList = ({ user }: any) => {
  const navigate = useNavigate();
  const { perfumeList } = useAppData();

  if (!perfumeList || perfumeList.length === 0) {
    return null;
  }

  const goToRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * perfumeList.length);
    const randomPerfume = perfumeList[randomIndex];
    if (randomPerfume?.id) {
      navigate(`/testing/${randomPerfume.id}`);
    }
  }, [navigate, perfumeList]); // ✅ Зависимости явно указаны

  return (
    <>
      <div className={styles.container}>
        {perfumeList.map(
          ({ id, name, perfumer, brand, notes: notesPerfume }: any) => {
            return (
              <NavLink
                key={id}
                // ✅ Убрали двоеточие!
                to={`/testing/${id}`}
                className={styles.testingItem}
                state={user}
              >
                {id}
              </NavLink>
            );
          },
        )}
      </div>
      <button className={`${styles.button}`} onClick={goToRandom}>
        рандомный
      </button>
    </>
  );
};
