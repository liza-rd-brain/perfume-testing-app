import { useState } from "react";
import styles from "./style.module.css";
import { useLocation, useRouteLoaderData } from "react-router";
import { supabase } from "~/lib/supabase";
import { loadSavedNotes } from "./loadSavedNotes";
import { Base, type Note } from "~/types";

export const TastingNew = ({
  noteList,
  userId,
  perfumeId,
  addNewNotes,
  notes,
}: {
  noteList: any;
  userId: number;
  perfumeId: number;
  notes: any;
  addNewNotes: (note: any) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [activeType, setActiveType] = useState(Base.BASE);

  const location = useLocation();
  console.log({ location });

  //   const perfumeList = rootData?.perfumeList || [];

  const handleSearchChange = ({
    e,
    activeType,
  }: {
    e: React.ChangeEvent<HTMLInputElement>;
    activeType: Base;
  }) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredNotes([]);
      return;
    }

    const results = notes?.filter((note: { name: string }) =>
      note.name.toLowerCase().includes(value.trim().toLowerCase()),
    );
    setFilteredNotes(results);
  };

  const addNote = async ({ note, type }: { note: Note; type: string }) => {
    console.log({ type });
    debugger;
    if (noteList[type].some((n: { id: number }) => n?.id === note?.id)) {
      console.log("Эта нота уже добавлена");
      return;
    }

    try {
      const { data, error } = await supabase.from("user_experience").insert([
        {
          user_id: userId,
          perfume_id: perfumeId, // ID текущего парфюма
          notes: { [type]: [note.id] },
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
    addNewNotes({ note: note.id, type });
    setSearchTerm("");
    setFilteredNotes([]);
  };

  const SearchItem = ({ title, type }: { title: string; type: string }) => {
    console.log({ activeType });
    return (
      <>
        <span>{title}</span>
        <div className="search-container">
          <input
            autoFocus={type === activeType}
            type="text"
            placeholder="Поиск по нотам..."
            value={activeType === type ? searchTerm : undefined}
            onChange={(e) => handleSearchChange({ e, activeType })}
            className="search-input"
            onFocus={() => setActiveType(type as Base)}
          />
        </div>
        <div className="results-container">
          {searchTerm.trim() && filteredNotes.length === 0 && (
            <p className="no-results">Ничего не найдено</p>
          )}

          {filteredNotes.length > 0 && activeType === type && (
            <ul className="notes-list">
              {filteredNotes.map((note) => {
                return (
                  <li
                    key={note.id}
                    className={styles["note-item"]}
                    onClick={() => addNote({ note, type })}
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
  return (
    <div className={styles["search-panel"]}>
      <SearchItem type={Base.TOP} title="верхние ноты"></SearchItem>
      <SearchItem type={Base.MIDDLE} title="cредние ноты"></SearchItem>
      <SearchItem type={Base.BASE} title="базовые ноты"></SearchItem>
    </div>
  );
};
