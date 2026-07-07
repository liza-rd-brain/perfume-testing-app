import { useState } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router";
import styles from "./style.module.css";
import { NoteList } from "~/components/NoteList";
import { supabase } from "~/lib/supabase";

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

  const addNote = async (note: Note) => {
    if (noteList.some((n) => n.id === note.id)) {
      console.log("Эта нота уже добавлена");
      return;
    }

    const userId = localStorage.getItem("userId");

    try {
      const { data, error } = await supabase.from("user_experience").insert([
        {
          user_id: userId,
          perfume_id: 1, // ID текущего парфюма
          notes: { middle: [...noteList, note] },
        },
      ]);

      if (error) {
        console.error("Ошибка Supabase:", error);
        console.log("Ошибка при сохранении");
      } else {
        console.log("Впечатления сохранены!");
        setNoteList([]); // Очищаем список
      }
    } catch (error) {
      console.error("Ошибка:", error);
      console.log("Не удалось сохранить");
    }
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
