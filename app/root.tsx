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
import { ThemeProvider } from "./context/ThemeContext";

export async function loader() {
  console.log("🔄 ===== ROOT LOADER ===== (ТОЛЬКО 1 РАЗ!)");
  const [notes, perfumeList] = await Promise.all([
    getAllNotes(),
    getPerfumeList(),
  ]);
  return { notes, perfumeList };
}

export default function Root() {
  const { notes, perfumeList, user } = useLoaderData();
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
      <body>
        <AppProvider value={{ notes, perfumeList, user }}>
          <ThemeProvider>
            <Outlet />
          </ThemeProvider>
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
