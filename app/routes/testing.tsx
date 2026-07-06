// app/routes/testing.tsx
import { useLocation, useParams } from "react-router";
import { TastingScreen } from "~/widgets/TastingScreen/TastingItem";

// ❌ Убираем loader - он не нужен
// export async function loader() { ... }

// ✅ Компонент использует данные из state
export default function Testing() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // ✅ Берем данные из state (переданные при навигации)
  const perfume = location;

  console.log({ location });

  // Если данных нет - показываем сообщение
  if (!perfume) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Аромат не найден</h2>
        <p>Пожалуйста, вернитесь на главную страницу</p>
        <button onClick={() => window.history.back()}>Назад</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Тестирование аромата #{id}</h1>
      {/*       <p>
        <strong>Название:</strong> {perfume?.name || null}
      </p>
      <p>
        <strong>Парфюмер:</strong> {perfume.perfumer}
      </p>
      <p>
        <strong>Бренд:</strong> {perfume.brand}
      </p> */}
      <TastingScreen />
    </div>
  );
}
