// app/context/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // ✅ Читаем сохраненную тему из localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    // Проверяем системные настройки
    if (!saved) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return (saved as Theme) || "light";
  });

  useEffect(() => {
    // ✅ Сохраняем тему в localStorage
    localStorage.setItem("theme", theme);

    // ✅ Добавляем класс к тегу html
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
