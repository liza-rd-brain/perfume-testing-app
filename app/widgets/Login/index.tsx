import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, password")
        .eq("password", password)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError("Неверный пароль");
        return;
      }

      localStorage.setItem("isAuthorized", "true");
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userName", data.name);

      onLoginSuccess();
    } catch (err) {
      setError("Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <h2>Введите пароль</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            disabled={loading}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Проверка..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};
