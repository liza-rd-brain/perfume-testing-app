import { useState } from "react";

interface TastingItemProps {
  notes: Note[];
  error?: string | null;
  perfumeList: any;
}

export const TastingItem = ({
  notes,
  error,
  perfumeList,
}: TastingItemProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  console.log({ perfumeList });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredNotes([]);
      return;
    }

    const results = notes.filter((note) =>
      note.name.toLowerCase().includes(value.trim().toLowerCase()),
    );
    setFilteredNotes(results);
  };

  if (error) {
    return <div className="error-message">Ошибка: {error}</div>;
  }

  return (
    <div className="tasting-board">
      <h1>Дегустационная доска</h1>
      <p>Всего нот: {notes.length}</p>

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
            {filteredNotes.map((note) => (
              <li key={note.id} className="note-item">
                <span className="note-name">{note.name}</span>
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
