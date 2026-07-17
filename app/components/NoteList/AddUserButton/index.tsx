import { useNavigate } from "react-router";
import { supabase } from "~/lib/supabase";
import { useAppContext } from "~/context/AppContext";

export const AddUserButton = () => {
  const navigate = useNavigate();
  const { setSavedNotes } = useAppContext();

  const handleAddUser = async () => {
    const name = prompt("Введите имя нового пользователя:");
    if (!name) return;

    const password = prompt("Введите пароль для нового пользователя:");
    if (!password) return;

    try {
      // 1. Создаём нового пользователя
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          name: name,
          password: password,
        })
        .select()
        .single();

      if (error) throw error;

      setSavedNotes([]);

      // 3. Переходим на главную
      navigate("/");

      console.log("✅ Новый пользователь создан:", newUser);
      alert(`Пользователь "${name}" создан!`);
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Не удалось создать пользователя");
    }
  };

  return (
    <button onClick={handleAddUser} className="add-user-btn">
      👤 Добавить пользователя
    </button>
  );
};
