import { useState } from "react";
import styles from "./style.module.css";
import { useLocation, useRouteLoaderData } from "react-router";
import { supabase } from "~/lib/supabase";
import { Base, type Note, type SavedNotes, type UserData } from "~/types";

export const TastingNew = ({
  noteList,
  userId,
  perfumeId,
  addNewNotes,
  notes,
  type,
  activeType,
  changeActiveType,
}: {
  noteList: Pick<SavedNotes, "top" | "middle" | "base" | "impression">;
  userId: number;
  perfumeId: number;
  notes: Note[];
  type: Base | null;
  activeType: Base | null;
  addNewNotes: ({ id, type }: { id: number; type: Base }) => void;
  changeActiveType: (type: Base) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  console.log({ noteList }, "TastingNew");

  const handleSearchChange = ({
    e,
    activeType,
  }: {
    e: React.ChangeEvent<HTMLInputElement>;
    activeType: Base | null;
  }) => {
    e.stopPropagation();
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

  const addNote = async ({
    note,
    type,
    e,
  }: {
    note: Note;
    type: Base;
    e: React.MouseEvent<HTMLLIElement, MouseEvent>;
  }) => {
    e.stopPropagation();

    try {
      // 1. Получаем существующую запись (если есть)
      const { data: existing } = await supabase
        .from("user-experience")
        .select("notes")
        .eq("user_id", userId)
        .eq("perfume_id", perfumeId)
        .maybeSingle();

      // 2. Готовим данные для сохранения
      const currentNotes = existing?.notes || {};
      const updatedNotes = {
        ...currentNotes,
        [type]: [...(currentNotes[type] || []), note.id],
      };

      // 3. UPSERT - если есть - обновит, если нет - создаст
      const { error } = await supabase.from("user-experience").upsert(
        {
          user_id: userId,
          perfume_id: perfumeId,
          notes: updatedNotes,
        },
        {
          onConflict: "user_id, perfume_id", // ✅ Теперь работает!
        },
      );

      if (error) throw error;

      addNewNotes({ id: note.id, type });
      setSearchTerm("");
      setFilteredNotes([]);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось сохранить");
    }
    setSearchTerm("");
    setFilteredNotes([]);
  };

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement, Element>,
    type: Base,
  ) => {
    e.stopPropagation();
    changeActiveType(type as Base);
  };

  const SearchItem = ({ type }: { type: string }) => {
    return (
      <>
        <div className={styles["search-container"]}>
          <input
            id={type}
            autoFocus={type === activeType}
            type="text"
            placeholder={`Поиск по ${type === Base.TOP ? "верхним" : type === Base.MIDDLE ? "средним" : "базовым"} нотам ...`}
            value={activeType === type ? searchTerm : undefined}
            onChange={(e) => handleSearchChange({ e, activeType })}
            className="search-input"
            onFocus={(e) => handleFocus(e, type as Base)}
          />
        </div>
        <div className={styles["results-container"]}>
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
                    onClick={(e) => addNote({ note, type, e })}
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

  const getType = (type: Base | null) => {
    switch (type) {
      case Base.TOP: {
        return <SearchItem type={Base.TOP}></SearchItem>;
      }
      case Base.MIDDLE: {
        return <SearchItem type={Base.MIDDLE}></SearchItem>;
      }
      case Base.BASE: {
        return <SearchItem type={Base.BASE}></SearchItem>;
      }
    }
  };

  return <div className={styles["search-panel"]}>{getType(type)}</div>;
};
