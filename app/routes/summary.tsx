import { useLocation, useParams } from "react-router";
import { useAppData } from "~/context/AppContext"; // ← Добавить!
import styles from "./route.module.css";
import { NoteList } from "~/components/NoteList";

import { ToIndexButton } from "~/components/NoteList/ToIndexButton";

export default function Summary(props: any) {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const { perfumeList, user, savedNotes } = useAppData();

  const perfumeFromState = location.state?.perfume;

  const perfumeFromContext = perfumeList?.find((p) => p.id === Number(id));

  const perfume = perfumeFromState || perfumeFromContext;

  const getSavedNotes = () => {
    return savedNotes.find(
      ({ perfume_id }: { perfume_id: number }) => perfume_id === Number(id),
    );
  };
  const currentNotes = getSavedNotes();

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
        <h1 className={styles["main-header"]}> Аромат №{id}</h1>
        <ToIndexButton />
        {/* <ForwardButton /> */}
      </div>
      <div className={styles["about-container"]}>
        <img
          className={styles["perfume-img"]}
          src={perfume.image}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className={styles["about-text"]}>
          <p>
            <strong>Название:</strong>
          </p>
          {perfume.name}
          {perfume.perfumer && (
            <p>
              <strong>Парфюмер:</strong>
            </p>
          )}
          {perfume.brand}
          <p>
            <strong>Бренд:</strong>
          </p>
          {perfume.brand}

          {perfume.link && (
            <a
              href={perfume.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["perfume-link"]}
            >
              ссылка на парфюм
            </a>
          )}
        </div>
      </div>
      {perfume.notes.top && (
        <>
          <h1 className={styles["header-summary"]}> Верхние ноты :</h1>

          <div className={styles["with-separator-block"]}>
            <NoteList noteList={perfume.notes.top} title="Ноты с фрагрантики" />
            {currentNotes?.top && (
              <NoteList noteList={currentNotes?.top} title="Твои ноты" />
            )}
          </div>
        </>
      )}
      <h1 className={styles["header-summary"]}>
        {!perfume.notes.top && !perfume.notes.base
          ? "Общие ноты"
          : "Средние ноты"}{" "}
        :
      </h1>
      <div className={styles["with-separator-block"]}>
        <NoteList noteList={perfume.notes.middle} title="Ноты с фрагрантики" />
        {currentNotes?.middle && (
          <NoteList noteList={currentNotes.middle} title="Твои ноты" />
        )}
      </div>
      {perfume.notes.top && (
        <>
          <h1 className={styles["header-summary"]}> Базовые ноты :</h1>

          <div className={styles["with-separator-block"]}>
            <NoteList
              noteList={perfume.notes.base}
              title="Ноты с фрагрантики"
            />

            <NoteList
              noteList={currentNotes?.base ? currentNotes.base : []}
              title="Твои ноты"
            />
          </div>
        </>
      )}
      {currentNotes?.impression && (
        <>
          <h1 className={styles["header-summary"]}> Заметка :</h1>
          <div className={styles["impressions-content"]}>
            {currentNotes.impression}
          </div>
        </>
      )}
    </div>
  );
}
