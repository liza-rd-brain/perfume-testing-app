// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import "./app.css";

import { AppProvider } from "./context/AppContext";
import { getSession } from "./lib/session.server";
import { loadAllSavedNotes } from "./widgets/TastingScreen/TastingItem/loadAllSavedNotes";
import { useEffect, useState } from "react";
import type { Note, Perfume, SavedNotes } from "./types";

// ✅ Импортируем из отдельного файла
import { getAllNotes, getPerfumeList } from "~/lib/data.server";

type LoaderData = {
  notes: Note[];
  perfumeList: Perfume[];
  userId: number | null;
  savedNotes: SavedNotes[];
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
  const data = useLoaderData<LoaderData>() || {};

  const {
    notes = [],
    perfumeList = [],
    userId = null,
    savedNotes: initialSavedNotes = [],
  } = data;

  const [savedNotes, setSavedNotes] = useState(initialSavedNotes);

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
