// app/context/AppContext.tsx
import { createContext, useContext } from "react";
import type { Note } from "./types";

interface AppData {
  user: any;
  notes: Note[];
  perfumeList: any[];
  savedNotes: any[];
}

const AppContext = createContext<AppData | null>(null);

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }
  return context;
}

export function AppProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AppData;
}) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
