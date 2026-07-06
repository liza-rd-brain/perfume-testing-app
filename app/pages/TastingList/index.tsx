import { useState } from "react";
import { NavLink, useLoaderData } from "react-router";
import styles from "./style.module.css";

export const TastingList = () => {
  const { notes, perfumeList } = useLoaderData<{
    notes: any[];
    user: any;
    error: string | null;
    perfumeList: any[];
  }>();

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const openTasting = (id: number) => {
    console.log(id);
  };

  if (!perfumeList || perfumeList.length === 0) {
    return null;
  }
  //TODO: показать рандомно, выбрать рандомный

  return (
    <>
      {perfumeList.map(
        ({ id, name, perfumer, brand, notes: notesPerfume }: any) => {
          return (
            <NavLink
              to={`/testing/:${id}`}
              className={styles.testingItem}
              key={id}
              state={{ id, name, perfumer, brand, notes: notesPerfume }}
            >
              {id}
            </NavLink>
          );
        },
      )}
    </>
  );
};
