import { useRouteLoaderData } from "react-router";
import styles from "./style.module.css";
import type { Base, Note } from "~/types";

export const NoteList = ({
  noteList,
  title,
  removeNote,
}: {
  noteList: number[];
  title: string;
  removeNote: (noteId: number) => void;
}) => {
  const rootData = useRouteLoaderData("root") as {
    notes?: Note[];
    perfumeList?: any[];
  } | null;
  const notes = rootData?.notes || [];

  const noteData = noteList.map((id) => notes?.find((note) => note.id === id));
  noteList;
  console.log({ noteData, noteList });

  const deleteNote = (noteId: number) => {
    removeNote(noteId);
  };

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
            <button
              className={styles["delete-button"]}
              onClick={() => deleteNote(note?.id || 0)}
            >
              {" "}
              ✕
            </button>
            <div className={styles["note-text"]}>{note?.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
