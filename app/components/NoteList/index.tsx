import { useRouteLoaderData } from "react-router";
import styles from "./style.module.css";
import type { Note } from "~/types";

export const NoteList = ({
  noteList,
  title,
}: {
  noteList: number[];
  title: string;
}) => {
  const rootData = useRouteLoaderData("root") as {
    notes?: Note[];
    perfumeList?: any[];
  } | null;
  const notes = rootData?.notes || [];

  const noteData = noteList.map((id) => notes?.find((note) => note.id === id));
  noteList;
  console.log({ noteData, noteList });

  const deleteNote = (noteId?: number) => {};

  return (
    <div className={styles["note-saved"]}>
      <div className={styles["note-title"]}>{title}</div>
      <div className={styles["note-list"]}>
        {noteData.map((note, index) => (
          <div key={index} className={styles["note-row"]}>
            {note?.image && (
              <img
                src={note.image}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            )}
            <span className={styles["delete-button"]}> ✕</span>
            <button
              className={styles["note-text"]}
              onClick={() => deleteNote(note?.id)}
            >
              {note?.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
