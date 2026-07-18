// app/routes/_index.tsx
import { redirect, useLoaderData, useLocation } from "react-router";
import { getUserId, getUserById } from "../lib/session.server";
import { TastingList } from "~/pages/TastingList";

import styles from "./route.module.css";
import { loadAllSavedNotes } from "~/widgets/TastingScreen/TastingItem/loadAllSavedNotes";
import { useAppContext } from "~/context/AppContext";
import { useEffect } from "react";

// ✅ Импортируем из отдельного файла
import { getAllNotes, getPerfumeList } from "~/lib/data.server";
import type { Note, Perfume, SavedNotes, User } from "~/types";

export async function loader({ request }: { request: Request }) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return redirect("/login");
    }

    const user = await getUserById(userId);
    if (!user) {
      return redirect("/login");
    }

    const [allNotes, perfumeData, savedNotes] = await Promise.all([
      getAllNotes(),
      getPerfumeList(),
      loadAllSavedNotes(Number(userId)),
    ]);

    return {
      perfumeList: perfumeData || [],
      notes: allNotes || [],
      user,
      savedNotes: savedNotes || [],
      error: null,
    };
  } catch (error) {
    console.error("💥 Fatal error:", error);
    return {
      perfumeList: [],
      notes: [],
      user: null,
      savedNotes: [],
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}

export const headers = () => ({
  "Cache-Control": "public, max-age=300",
});

export const shouldRevalidate = () => true;

type LoaderData = {
  perfumeList: Perfume[];
  notes: Note[];
  user: User;
  error: string | null;
  savedNotes: SavedNotes[];
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const { savedNotes, perfumeList, user } = useAppContext(); //

  if (data?.error) {
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ color: "red" }}>⚠️ Ошибка загрузки</h2>
        <p>{data.error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className={styles["page-layout"]}>
      <h1>Список пробников</h1>
      {/* ✅ Передаём данные из контекста, а не из loader */}
      <TastingList
        perfumeList={perfumeList}
        savedNotes={savedNotes}
        user={user}
      />
    </div>
  );
}
