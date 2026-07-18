import { useRouteLoaderData } from "react-router";
import styles from "./style.module.css";
import type { Base, Note, PerfumeInSet } from "~/types";

export const NoteList = ({
  noteList,
  title,
  removeNote,
}: {
  noteList: number[];
  title: string;
  removeNote?: (noteId: number) => void;
}) => {
  const rootData = useRouteLoaderData("root") as {
    notes?: Note[];
    perfumeList?: PerfumeInSet[];
  } | null;
  const notes = rootData?.notes || [];

  console.log({ rootData }, "NoteList");

  const noteData = noteList?.map((item: number | { id: number }) =>
    notes?.find((note) => {
      if (typeof item === "number") {
        return note.id === item;
      } else {
        return note.id === item.id;
      }
    }),
  );

  const deleteNote = (noteId: number) => {
    removeNote?.(noteId);
  };

  return (
    <div className={styles["note-saved"]}>
      <div className={styles["note-title"]}>{title}</div>
      <div className={styles["note-list"]}>
        {noteData &&
          noteData.map((note, index) => (
            <div key={index} className={styles["note-row"]}>
              {note?.image && (
                <div className={styles["image-wrapper"]}>
                  <img
                    src={note.image}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              )}
              {removeNote && (
                <button
                  className={styles["delete-button"]}
                  onClick={() => deleteNote(note?.id || 0)}
                >
                  ✕
                </button>
              )}
              <div className={styles["note-text"]}>{note?.name}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
