// app/context/AppContext.tsx
import { createContext, useContext, type ReactNode } from "react";

interface Note {
  id: number;
  name: string;
  image?: string;
  url?: string;
}

interface Perfume {
  id: number;
  name: string;
  perfumer: string;
  brand: string;
  link?: string;
  notes?: any;
  impression: string;
}

// ✅ Тип для setSavedNotes (поддерживает массив или функцию)
type SetSavedNotesType = (payload: any[] | ((prev: any[]) => any[])) => void;

interface AppContextType {
  notes: Note[];
  perfumeList: Perfume[];
  user?: any;
  isLoading?: boolean;
  error?: string | null;
  savedNotes: any[]; // ✅ Всегда массив
  setSavedNotes: SetSavedNotesType; // ✅ Правильный тип
}

// ✅ Создаем контекст с дефолтными значениями
const AppContext = createContext<AppContextType>({
  notes: [],
  perfumeList: [],
  user: null,
  isLoading: false,
  error: null,
  savedNotes: [], // ✅ Всегда массив
  setSavedNotes: () => {},
});

// ✅ Хук для удобного использования
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

// ✅ Хук для получения данных (можно оставить или убрать, дублирует useAppContext)
export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }
  return context;
};

// ✅ Провайдер (просто пробрасывает value)
export const AppProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: AppContextType;
}) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
