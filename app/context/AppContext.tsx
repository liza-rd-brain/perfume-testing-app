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
}

interface AppContextType {
  notes: Note[];
  perfumeList: Perfume[];
  user?: any;
  isLoading?: boolean;
  error?: string | null;
}

// ✅ Создаем контекст с дефолтными значениями
const AppContext = createContext<AppContextType>({
  notes: [],
  perfumeList: [],
  user: null,
  isLoading: false,
  error: null,
});

// ✅ Хук для удобного использования
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
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
