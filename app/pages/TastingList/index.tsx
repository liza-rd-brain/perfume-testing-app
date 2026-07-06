import { useState } from "react";
import { NavLink } from "react-router"; // ← Убрали useLoaderData
import styles from "./style.module.css";
import { useAppData } from "~/context/AppContext"; // ← Добавили!

export const TastingList = () => {
  // ✅ Используем контекст вместо useLoaderData!
  const { notes, perfumeList } = useAppData();

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  if (!perfumeList || perfumeList.length === 0) {
    return null;
  }

  return (
    <>
      {perfumeList.map(
        ({ id, name, perfumer, brand, notes: notesPerfume }: any) => {
          return (
            <NavLink
              key={id}
              // ✅ Убрали двоеточие!
              to={`/testing/${id}`}
              className={styles.testingItem}
              state={{
                perfume: { id, name, perfumer, brand, notes: notesPerfume },
              }}
            >
              {id}
            </NavLink>
          );
        },
      )}
    </>
  );
};
