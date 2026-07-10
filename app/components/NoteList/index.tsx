import styles from "./style.module.css";

export const NoteList = ({
  noteList,
  title,
}: {
  noteList: Note[];
  title: string;
}) => {
  return (
    <div>
      <div>{title}</div>
      <div className={styles["note-list"]}>
        {noteList.map((note) => (
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
