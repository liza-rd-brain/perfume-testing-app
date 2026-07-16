import { useEffect, useRef, useState } from "react";
import {
  NavLink,
  useLocation,
  useParams,
  useRouteLoaderData,
} from "react-router";
import styles from "./style.module.css";
import { NoteList } from "~/components/NoteList";
import { supabase } from "~/lib/supabase";

import { usePersistedUser } from "~/hooks/usePersistedUser";

import { TastingNew } from "./TastingNew";
import { Base, type Note } from "~/types";

interface TastingScreenProps {
  notes: Note[];
  error?: string | null;
  perfumeList: any;
}

async function getSavedNotes(userId: string, perfumeId: number) {
  const { data, error } = await supabase
    .from("user_experience")
    .select("notes")
    .eq("user_id", userId)
    .eq("perfume_id", perfumeId)
    .single();

  if (error) {
    console.error("❌ Ошибка получения нот:", error);
    return null;
  }

  return data?.notes || null;
}

// ✅ Конфигурация секций для навигации
const SECTIONS = [
  { id: "top-notes", label: "Верха " },
  { id: "middle-notes", label: "Сердце " },
  { id: "base-notes", label: "База " },
  { id: "impressions", label: "Заметка" },
];

export const TastingScreen = (props: any) => {
  const rootData = useRouteLoaderData("root") as {
    notes: Note[];
    perfumeList?: any[];
    impression: string;
    savedNotes: any[];
  } | null;
  const notes = rootData?.notes || [];
  const savedNotes = rootData?.savedNotes || [];
  const params = useParams();
  const perfumeId = parseInt(params.id || "0");

  const getInitialState = () => {
    return savedNotes.find(({ perfume_id }) => perfume_id === perfumeId);
  };

  const [noteList, setNoteList] = useState<{
    top: number[];
    base: number[];
    middle: number[];
    impression: string;
  }>(getInitialState);

  console.log(noteList);

  const [isLoading, setIsLoading] = useState(true);
  const [activeType, setActiveType] = useState<Base | null>(Base.TOP);
  const [activeSection, setActiveSection] = useState<string>("top-notes");

  const location = useLocation();
  const userIdLocal = usePersistedUser(location?.state?.id);

  const userId = location?.state?.id || userIdLocal;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.value = noteList?.impression || "";
    }
  }, []);

  //  скролл к секции (без изменения URL)
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setActiveSection(sectionId);
      if (sectionId === "top-notes") {
        setActiveType(Base.TOP);
      } else if (sectionId === "middle-notes") {
        setActiveType(Base.MIDDLE);
      } else if (sectionId === "base-notes") {
        setActiveType(Base.BASE);
      } else {
        setActiveType(null);
        textareaRef?.current?.focus();
      }

      element.scrollIntoView({
        behavior: "auto",
        block: sectionId === "impressions" ? "end" : "start",
      });
    }
  };

  const addNewNotes = ({ id, type }: { id: number; type: Base }) => {
    setNoteList((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), id],
    }));
  };

  const changeActiveType = (type: Base) => {
    setActiveType(type);
  };

  const removeNote = async ({
    noteId,
    type,
  }: {
    noteId: number;
    type: Base;
  }) => {
    try {
      const { data: existing } = await supabase
        .from("user_experience")
        .select("notes")
        .eq("user_id", userId)
        .eq("perfume_id", perfumeId)
        .maybeSingle();

      if (!existing) {
        console.log("Запись не найдена");
        return;
      }

      const currentNotes = existing.notes || {};
      const updatedNotes = {
        ...currentNotes,
        [type]: currentNotes[type]?.filter((id: number) => id !== noteId) || [],
      };

      if (Object.keys(updatedNotes).length === 0) {
        const { error } = await supabase
          .from("user_experience")
          .delete()
          .eq("user_id", userId)
          .eq("perfume_id", perfumeId);

        if (error) throw error;

        console.log("✅ Запись полностью удалена");
      } else {
        const { error } = await supabase
          .from("user_experience")
          .update({ notes: updatedNotes })
          .eq("user_id", userId)
          .eq("perfume_id", perfumeId);

        setNoteList((prev) => ({
          ...prev,
          [type]: prev[type]?.filter((id: number) => id !== noteId) || [],
        }));

        if (error) throw error;

        console.log("✅ Нота удалена");
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      alert("Не удалось удалить ноту");
    }
  };

  const handleRemove = (type: Base) => (noteId: number) => {
    removeNote({ noteId, type });
  };

  const saveText = async () => {
    const handledText = textareaRef?.current?.value.replaceAll("\n", " ");
    console.log({ handledText });
    const { error } = await supabase.from("user_experience").upsert(
      {
        user_id: userId,
        perfume_id: perfumeId,
        impression: handledText,
      },
      {
        onConflict: "user_id, perfume_id", // ✅ Теперь работает!
      },
    );
  };

  return (
    <div className={styles["tasting-board"]}>
      {/* ✅ Навигационные плашки — кнопки, не ссылки */}
      <nav className={styles["section-nav"]}>
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles["nav-link"]} ${
              activeSection === id ? styles["active"] : ""
            }`}
            onClick={() => scrollToSection(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ✅ Секция "Верхние ноты" */}
      <section id="top-notes" className={styles["section"]}>
        <div
          className={`
          ${activeType === Base.TOP ? styles["tasting-type"] : undefined} 
          ${styles["tasting-container"]}
        `}
        >
          <NoteList
            noteList={noteList?.top}
            title="Верхние ноты"
            removeNote={handleRemove(Base.TOP)}
          />
          <TastingNew
            activeType={activeType}
            type={Base.TOP}
            noteList={noteList}
            userId={userId}
            perfumeId={perfumeId}
            notes={notes}
            addNewNotes={addNewNotes}
            changeActiveType={changeActiveType}
          />
        </div>
      </section>

      {/* ✅ Секция "Средние ноты" */}
      <section id="middle-notes" className={styles["section"]}>
        <div
          className={`
          ${activeType === Base.MIDDLE ? styles["tasting-type"] : undefined}
          ${styles["tasting-container"]}
        `}
        >
          <NoteList
            noteList={noteList?.middle}
            title="Средние ноты"
            removeNote={handleRemove(Base.MIDDLE)}
          />
          <TastingNew
            activeType={activeType}
            type={Base.MIDDLE}
            noteList={noteList}
            userId={userId}
            perfumeId={perfumeId}
            notes={notes}
            addNewNotes={addNewNotes}
            changeActiveType={changeActiveType}
          />
        </div>
      </section>

      {/* ✅ Секция "Базовые ноты" */}
      <section id="base-notes" className={styles["section"]}>
        <div
          className={`
          ${activeType === Base.BASE ? styles["tasting-type"] : undefined}
          ${styles["tasting-container"]}
        `}
        >
          <NoteList
            noteList={noteList?.base}
            title="Базовые ноты"
            removeNote={handleRemove(Base.BASE)}
          />
          <TastingNew
            activeType={activeType}
            type={Base.BASE}
            noteList={noteList}
            userId={userId}
            perfumeId={perfumeId}
            notes={notes}
            addNewNotes={addNewNotes}
            changeActiveType={changeActiveType}
          />
        </div>
      </section>

      {/* ✅ Секция "Общие впечатления" */}
      <section id="impressions" className={styles["section"]}>
        <h2 className={styles["section-title"]}>Заметка</h2>
        <div>
          <textarea
            placeholder="Твои впечатления от парфюма"
            className={styles["impressions-content"]}
            ref={textareaRef}
            id="story"
            name="story"
            rows={5}
            defaultValue=""
            onBlur={saveText}
          />
        </div>
      </section>

      <NavLink
        key={perfumeId}
        to={`/result/${perfumeId}`}
        className={`${styles.testingItem} ${styles.link}`}
        state={noteList}
      >
        Перейти к результатам
      </NavLink>
    </div>
  );
};
