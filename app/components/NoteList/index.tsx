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
      <div>
        {noteList.map((note) => (
          <>
            <span>{note.name}</span>
            {note.image && (
              <img
                src={note.image}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
};
