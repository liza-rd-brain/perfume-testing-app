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
import { Base, type Note, type Perfume, type SavedNotes } from "~/types";
import commonStyles from "~/style/common.module.css";

interface TastingScreenProps {
  notes: Note[];
  error?: string | null;
  perfumeList: Perfume[];
}

const SECTIONS = [
  { id: "top-notes", label: "Верха" },
  { id: "middle-notes", label: "Сердце" },
  { id: "common-notes", label: "Общие ноты" },
  { id: "base-notes", label: "База" },
  { id: "impressions", label: "Заметка" },
];

export const TastingScreen = () => {
  //TODO: используем потому что это именно компонент! а не роут! почитать!
  const rootData = useRouteLoaderData("root") as {
    notes: Note[];
    perfumeList?: Perfume[];
    impression: string;
    savedNotes: SavedNotes[];
    isDone: boolean;
    userId: number;
    setSavedNotes: any;
  } | null;

  const notes = rootData?.notes || [];
  const savedNotes = rootData?.savedNotes || [];
  const params = useParams();
  const perfumeId = parseInt(params.id || "0");

  const updateSavedNotes = rootData?.setSavedNotes;

  const getInitialState = () => {
    // Проверяем, что savedNotes - массив
    if (!Array.isArray(savedNotes) || savedNotes.length === 0) {
      return {
        notes: { top: [], base: [], middle: [] },
        impression: "",
      };
    }

    const found = savedNotes.find(({ perfume_id }) => perfume_id === perfumeId);

    // Если нашли - возвращаем, иначе - дефолтное состояние
    return (
      found || {
        notes: { top: [], base: [], middle: [] },
        impression: "",
      }
    );
  };

  const [noteList, setNoteList] = useState<{
    notes: { top: number[]; base: number[]; middle: number[] };
    impression: string;
  }>(getInitialState);

  console.log({ noteList });

  const {
    top = [],
    base = [],
    middle = [],
  } = rootData?.perfumeList?.[perfumeId - 1]?.notes ?? {};

  const [activeType, setActiveType] = useState<Base | null>(Base.TOP);
  const [activeSection, setActiveSection] = useState<string>(
    !!top.length ? "top-notes" : "common-notes",
  );

  const location = useLocation();
  const userIdLocal = usePersistedUser(location?.state?.id);

  const userId = location?.state?.id || userIdLocal || rootData?.userId;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef?.current) {
      textareaRef.current.value = noteList?.impression || "";
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveText();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
      } else if (sectionId === "common-notes") {
        setActiveType(Base.MIDDLE);
      } else if (sectionId === "base-notes") {
        setActiveType(Base.BASE);
      } else {
        setActiveType(null);
        textareaRef?.current?.focus();
      }

      element.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }
  };

  const addNewNotes = ({ id, type }: { id: number; type: Base }) => {
    setNoteList((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [type]: [...(prev.notes[type] || []), id],
      },
    }));

    updateSavedNotes?.((prev: any) => ({
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
        .from("user-experience")
        .select("notes")
        .eq("user_id", userId)
        .eq("perfume_id", perfumeId)
        .maybeSingle();

      if (!existing) {
        return;
      }

      const currentNotes = existing.notes || {};
      const updatedNotes = {
        ...currentNotes,
        [type]: currentNotes[type]?.filter((id: number) => id !== noteId) || [],
      };

      if (Object.keys(updatedNotes).length === 0) {
        const { error } = await supabase
          .from("user-experience")
          .delete()
          .eq("user_id", userId)
          .eq("perfume_id", perfumeId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user-experience")
          .update({ notes: updatedNotes })
          .eq("user_id", userId)
          .eq("perfume_id", perfumeId);

        setNoteList((prev) => ({
          ...prev,
          notes: {
            ...prev.notes,
            [type]: [
              ...(prev.notes[type]?.filter((id: number) => id !== noteId) ||
                []),
            ],
          },
        }));
        updateSavedNotes?.((prev: any) => ({
          ...prev,
          [type]: prev[type]?.filter((id: number) => id !== noteId) || [],
        }));

        if (error) throw error;
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
    const handledText = textareaRef?.current?.value?.trim() || "";

    // ✅ Если текст пустой - ничего не делаем
    if (!handledText) {
      return;
    }

    try {
      // ✅ Проверяем, существует ли запись
      const { data: existing, error: checkError } = await supabase
        .from("user-experience")
        .select("id, impression")
        .eq("user_id", userId)
        .eq("perfume_id", perfumeId)
        .maybeSingle();

      if (checkError) {
        console.error("❌ Ошибка проверки:", checkError);
        return;
      }

      // ✅ UPSERT
      const { error } = await supabase.from("user-experience").upsert(
        {
          user_id: userId,
          perfume_id: perfumeId,
          impression: handledText,
        },
        {
          onConflict: "user_id, perfume_id",
        },
      );

      if (error) {
        console.error("❌ Ошибка сохранения:", error);
        return;
      }

      // ✅ Обновляем состояние
      setNoteList((prev) => ({
        ...prev,
        impression: handledText,
      }));
      updateSavedNotes((prev: any) => ({
        ...prev,
        impression: handledText,
      }));
    } catch (error) {
      console.error("💥 Ошибка при сохранении:", error);
    }
  };

  const getCurrentSection = () => {
    if (top.length && base.length) {
      return SECTIONS.filter(({ id }) => id !== "common-notes");
    } else {
      return SECTIONS.filter(
        ({ id }) => id === "common-notes" || id === "impressions",
      );
    }
  };

  return (
    <div className={styles["tasting-board"]}>
      {/* ✅ Навигационные плашки — кнопки, не ссылки */}
      <nav className={styles["section-nav"]}>
        {getCurrentSection().map(({ id, label }) => (
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
      {!!top.length && (
        <section id="top-notes" className={styles["section"]}>
          <div
            className={`
          ${activeType === Base.TOP ? styles["tasting-type"] : undefined} 
          ${styles["tasting-container"]}
        `}
          >
            <NoteList
              noteList={noteList.notes?.top}
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
      )}

      {/* ✅ Секция "Средние ноты" */}
      <section
        id={top?.length && base.length ? "middle-notes" : "common-notes"}
        className={styles["section"]}
      >
        <div
          className={`
          ${activeType === Base.MIDDLE ? styles["tasting-type"] : undefined}
          ${styles["tasting-container"]}
        `}
        >
          <NoteList
            noteList={noteList.notes?.middle}
            title={top?.length && base.length ? "Средние ноты" : "Общие ноты"}
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
      {!!base.length && (
        <section id="base-notes" className={styles["section"]}>
          <div
            className={`
          ${activeType === Base.BASE ? styles["tasting-type"] : undefined}
          ${styles["tasting-container"]}
        `}
          >
            <NoteList
              noteList={noteList.notes?.base}
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
      )}

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
        className={`${commonStyles.button} `}
        state={noteList}
        // onClick={(e) => {
        //   if (true) {
        //     e.preventDefault();
        //   }
        // }}
      >
        Проверить угаданные ноты
      </NavLink>
    </div>
  );
};
