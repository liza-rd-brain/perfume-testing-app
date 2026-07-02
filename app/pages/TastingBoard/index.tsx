import { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

interface Note {
  id: number;
  name: string;
  url: string;
  description?: string;
}

// 📦 Локальные данные (замените на свои)
const LOCAL_NOTES: Note[] = [
  { id: 1, name: "бергамот", url: "/notes/bergamot" },
  { id: 2, name: "лимон", url: "/notes/lemon" },
  { id: 3, name: "мандарин", url: "/notes/mandarin" },
  { id: 4, name: "роза", url: "/notes/rose" },
  { id: 5, name: "жасмин", url: "/notes/jasmine" },
  { id: 6, name: "мускус", url: "/notes/musk" },
  { id: 7, name: "дубовый мох", url: "/notes/oakmoss" },
  { id: 8, name: "амбра", url: "/notes/amber" },
  { id: 9, name: "ваниль", url: "/notes/vanilla" },
  { id: 10, name: "пачули", url: "/notes/patchouli" },
];

export const TastingBoard = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Локальный поиск (без запросов к БД)
  const searchNotesLocally = (query: string) => {
    if (!query.trim()) {
      setFilteredNotes([]);
      return;
    }

    setIsLoading(true);

    // Имитация задержки (для UX)
    setTimeout(() => {
      const results = LOCAL_NOTES.filter((note) =>
        note.name.toLowerCase().includes(query.trim().toLowerCase()),
      );
      setFilteredNotes(results);
      setIsLoading(false);
    }, 150);
  };

  // Дебаунс: ждём 300ms после последнего ввода
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        searchNotesLocally(query);
      }, 300),
    [],
  );

  // Обработчик изменения поля ввода
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Отмена дебаунса при размонтировании
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="tasting-board">
      <h1>Дегустационная доска</h1>

      {/* Поле поиска */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск по нотам..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        {isLoading && <span className="loader">⏳</span>}
      </div>

      {/* Результаты */}
      <div className="results-container">
        {searchTerm.trim() && filteredNotes.length === 0 && !isLoading && (
          <p className="no-results">Ничего не найдено</p>
        )}

        {filteredNotes.length > 0 && (
          <ul className="notes-list">
            {filteredNotes.map((note) => (
              <li key={note.id} className="note-item">
                <span className="note-name">{note.name}</span>
                {note.description && (
                  <span className="note-description">{note.description}</span>
                )}
                {note.url && (
                  <a
                    href={note.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="note-link"
                  >
                    🔗
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
