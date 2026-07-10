import { useState } from "react";
import { NavLink, redirect, useNavigate } from "react-router"; // ← Убрали useLoaderData
import styles from "./style.module.css";
import { useAppData } from "~/context/AppContext"; // ← Добавили!

export const TastingList = ({ user }: any) => {
  // ✅ Используем контекст вместо useLoaderData!
  const navigate = useNavigate();
  const { notes, perfumeList } = useAppData();

  console.log({ user }, "TastingList");

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  if (!perfumeList || perfumeList.length === 0) {
    return null;
  }

  const goToRandom = () => {
    const randomNumber = Math.floor(Math.random() * 15) + 1;
    navigate(`/testing/${randomNumber}`);
  };

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
