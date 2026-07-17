import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import "./app.css";
import { getAllNotes, getPerfumeList } from "./routes/_index";
import { AppProvider } from "./context/AppContext";
import { getSession } from "./lib/session.server";
import { loadAllSavedNotes } from "./widgets/TastingScreen/TastingItem/loadAllSavedNotes";
import { useState, useEffect } from "react";
import type { Note } from "./types";

// ✅ Типизация для loader
type LoaderData = {
  notes: Note[];
  perfumeList: any[];
  userId: number | null;
  savedNotes: any[];
};

export async function loader({ request }: { request: Request }) {
  try {
    const [notes, perfumeList] = await Promise.all([
      getAllNotes(),
      getPerfumeList(),
    ]);

    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    const savedNotes = userId ? await loadAllSavedNotes(userId) : [];

    return {
      notes: notes || [],
      perfumeList: perfumeList || [],
      userId: userId || null,
      savedNotes: savedNotes || [],
    };
  } catch (error) {
    console.error("❌ Loader error:", error);
    return {
      notes: [],
      perfumeList: [],
      userId: null,
      savedNotes: [],
    };
  }
}

export default function Root() {
  // ✅ Безопасное получение данных с дефолтными значениями
  const data = useLoaderData<LoaderData>() || {};

  const {
    notes = [],
    perfumeList = [],
    userId = null,
    savedNotes: initialSavedNotes = [],
  } = data;

  // ✅ Состояние с защитой от undefined
  const [savedNotes, setSavedNotes] = useState<any[]>(
    Array.isArray(initialSavedNotes) ? initialSavedNotes : [],
  );

  // ✅ Синхронизация с данными из loader
  useEffect(() => {
    if (Array.isArray(initialSavedNotes)) {
      setSavedNotes(initialSavedNotes);
    }
  }, [initialSavedNotes]);

  console.log("🔍 Root state:", {
    notesLength: notes.length,
    perfumeListLength: perfumeList.length,
    userId,
    savedNotesLength: savedNotes.length,
  });

  // ✅ Проверка, что данные загружены
  if (!notes || !perfumeList) {
    return (
      <html lang="ru">
        <body>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>Загрузка данных...</h2>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="referrer" content="no-referrer" />

        <link rel="preconnect" href="https://www.fragrantica.ru" />
        <link rel="dns-prefetch" href="https://www.fragrantica.ru" />
        <Meta />
        <Links />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AppProvider
          value={{
            notes: Array.isArray(notes) ? notes : [],
            perfumeList: Array.isArray(perfumeList) ? perfumeList : [],
            user: userId,
            savedNotes: Array.isArray(savedNotes) ? savedNotes : [],
            setSavedNotes,
          }}
        >
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
