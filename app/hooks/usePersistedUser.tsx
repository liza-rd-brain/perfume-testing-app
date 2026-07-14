// app/hooks/usePersistedUser.tsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router";

export function usePersistedUser(userId?: string) {
  const location = useLocation();
  const [user, setUser] = useState<string | null>(null);
  
  if (typeof window === "undefined") return null;

  useEffect(() => {
    // ✅ localStorage доступен только в браузере
    if (typeof window === "undefined") return;

    // 1. Если передан userId в аргументе - используем его
    if (userId) {
      localStorage.setItem("userId", JSON.stringify(userId));
      setUser(userId);
      return;
    }

    const saved = localStorage.getItem("userId");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
        return;
      } catch {
        setUser(null);
        return;
      }
    }

    setUser(null);
  }, [userId, location.state]);

  return user;
}
