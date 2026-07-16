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

export async function loader({ request }: { request: Request }) {
  const [notes, perfumeList] = await Promise.all([
    getAllNotes(),
    getPerfumeList(),
  ]);
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const savedNotes = await loadAllSavedNotes(userId);
  return { notes, userId, perfumeList, savedNotes };
}

export default function Root() {
  const { notes, perfumeList, userId, savedNotes } = useLoaderData();

  console.log({ savedNotes });
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
        ></link>
      </head>
      <body suppressHydrationWarning>
        <AppProvider value={{ notes, perfumeList, user: userId, savedNotes }}>
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
