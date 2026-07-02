import { useState } from "react";
import styles from "./style.module.css";
import { loginWithPassword } from "../../services/authService";

interface LoginModalProps {
  onLoginSuccess: (userId: string, userName: string) => void;
  onClose?: () => void;
}

export const Login = ({ onLoginSuccess, onClose }: LoginModalProps) => {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Запрос к Supabase через наш сервис
      const result = await loginWithPassword(password.trim());

      if (result.success && result.userId) {
        // Успешный вход
        localStorage.setItem("isAuthorized", "true");
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("userName", result.userName || "Дегустатор");

        // Вызываем callback родителя
        onLoginSuccess(result.userId, result.userName || "Дегустатор");
      } else {
        // Ошибка входа
        setError(result.error || "Неверный пароль");
      }
    } catch (err) {
      setError("Ошибка соединения. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="password"
            className={`${styles.input} ${error ? styles.inputError : ""}`}
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            disabled={isLoading}
          />

          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Проверка..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};
