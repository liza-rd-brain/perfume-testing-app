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

interface AppContextType {
  notes: Note[];
  perfumeList: Perfume[];
  user?: any;
  isLoading?: boolean;
  error?: string | null;
  savedNotes: any;
}

// ✅ Создаем контекст с дефолтными значениями
const AppContext = createContext<AppContextType>({
  notes: [],
  perfumeList: [],
  user: null,
  isLoading: false,
  error: null,
  savedNotes: null,
});

// ✅ Хук для удобного использования
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const useAppData = () => {
  // 1. Берем данные из контекста
  const context = useContext(AppContext);

  // 2. Проверяем, что контекст существует
  if (!context) {
    throw new Error("useAppData must be used within AppProvider");
  }

  // 3. Возвращаем данные
  return context; // ← { notes, perfumeList, user, isLoading, error }
};

// ✅ Провайдер
export const AppProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: AppContextType;
}) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
