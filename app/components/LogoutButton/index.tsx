// app/components/LogoutButton.tsx
import { useSubmit } from "react-router";
import { useAppContext } from "~/context/AppContext";

export const LogoutButton = () => {
  const submit = useSubmit();
  const { setSavedNotes } = useAppContext();

  const handleLogout = () => {
    // 1. Очищаем контекст

    setSavedNotes([]);

    // 2. Очищаем куки
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    // 3. Очищаем localStorage
    localStorage.clear();
    sessionStorage.clear();

    // 4. Отправляем на сервер
    submit(null, { method: "post", action: "/logout" });

    // 5. ✅ ПОЛНАЯ ПЕРЕЗАГРУЗКА (самое надёжное)
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <button
      onClick={handleLogout}
      style={{ padding: "8px 16px", cursor: "pointer" }}
    >
      🚪 Выйти
    </button>
  );
};
