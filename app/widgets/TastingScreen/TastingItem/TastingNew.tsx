import { useState } from "react";
import styles from "./style.module.css";
import { useLocation, useRouteLoaderData } from "react-router";
import { supabase } from "~/lib/supabase";
import { loadSavedNotes } from "./loadSavedNotes";

export const TastingNew = ({
  noteList,
  userId,
  perfumeId,
  addNewNotes,
}: {
  noteList: any;
  userId: number;
  perfumeId: number;
  addNewNotes: (note: any) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const rootData = useRouteLoaderData("root") as {
    notes?: Note[];
    perfumeList?: any[];
  } | null;

  const location = useLocation();
  console.log({ location });

  const notes = rootData?.notes || [];
  const perfumeList = rootData?.perfumeList || [];

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

  const addNote = async (note: Note) => {
    if (noteList.some((n: { id: number }) => n.id === note.id)) {
      console.log("Эта нота уже добавлена");
      return;
    }

    try {
      const { data, error } = await supabase.from("user_experience").insert([
        {
          user_id: userId,
          perfume_id: perfumeId, // ID текущего парфюма
          notes: { middle: [...noteList, note] },
        },
      ]);

      if (error && error !== null) {
        console.error("Ошибка Supabase:", error);
        console.log("Ошибка при сохранении");
      } else {
        console.log("Впечатления сохранены!");
        // setNoteList([]); // Очищаем список
      }
    } catch (error) {
      console.error("Ошибка:", error);
      console.log("Не удалось сохранить");
    }
    addNewNotes(note);
    loadSavedNotes({ userId, perfumeId });
    setSearchTerm("");
    setFilteredNotes([]);
  };

  return (
    <>
      {" "}
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
    </>
  );
};
