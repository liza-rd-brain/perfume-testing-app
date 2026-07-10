import { useRouteLoaderData } from "react-router";
import styles from "./style.module.css";

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

  const noteData = notes?.filter((note: Note) => noteList.includes(note.id));

  console.log({ noteData, noteList });

  return (
    <div>
      <div>{title}</div>
      <div className={styles["note-list"]}>
        {noteData.map((note) => (
          <div key={note.id}>
            <span>{note.name}</span>
            {note.image && (
              <img
                src={note.image}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
