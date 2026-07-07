import { useState } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router";
import styles from "./style.module.css";
import { NoteList } from "~/components/NoteList";

interface TastingScreenProps {
  notes: Note[];
  error?: string | null;
  perfumeList: any;
}

export const TastingScreen = () => {
  const rootData = useRouteLoaderData("root") as {
    notes?: Note[];
    perfumeList?: any[];
  } | null;

  const notes = rootData?.notes || [];
  const perfumeList = rootData?.perfumeList || [];

  const [noteList, setNoteList] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const addNote = (note: Note) => {
    setNoteList((prev) => [...prev, note]);
    setSearchTerm("");
    setFilteredNotes([]);
  };

  // console.log({ notes, perfumeList });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredNotes([]);
      return;
    }

    const results = notes?.filter((note) =>
      note.name.toLowerCase().includes(value.trim().toLowerCase()),
    );
    setFilteredNotes(results);
  };

  // if (error) {
  //   return <div className="error-message">Ошибка: {error}</div>;
  // }

  return (
    <div className="tasting-board">
      {/* <h1>Дегустационная доска</h1>
      <p>Всего нот: {notes?.length || 0}</p> */}
      <span>Выбранные ноты</span>
      <div>
        <NoteList noteList={noteList} title="Верхние ноты" />
        {/* {noteList.map((item) => (
          <span>{item.name}</span>
        ))} */}
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск по нотам..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="results-container">
        {searchTerm.trim() && filteredNotes.length === 0 && (
          <p className="no-results">Ничего не найдено</p>
        )}

        {filteredNotes.length > 0 && (
          <ul className="notes-list">
            {filteredNotes.map((note) => {
              // console.log({ note });

              return (
                <li
                  key={note.id}
                  className={styles["note-item"]}
                  onClick={() => addNote(note)}
                >
                  <span className="note-name">{note.name}</span>
                  {note.image && (
                    <img
                      src={note.image}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
