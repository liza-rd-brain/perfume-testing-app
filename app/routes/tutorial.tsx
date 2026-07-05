import { Form, redirect, useNavigation } from "react-router";
// ✅ Серверный код в action
export async function action() {
  // Импортируем функцию ТОЛЬКО здесь, внутри action
  const { createUserDoneTutorial } = await import("~/lib/session.server");
  console.log("start");
  //тут рисовать прелоадер
  await createUserDoneTutorial("/");
  console.log("финиш");
  return redirect("/");
}

// ✅ Проверяем куку при загрузке страницы
export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");

  // Если кука tutorial_done есть - редирект на главную
  if (cookieHeader?.includes("tutorialSkipped=true")) {
    console.log("скипнуть туториал");
    // return redirect("/");
  }

  return null;
}

export default function Tutorial() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <h2>Небольшой парф затест</h2>
      <div>
        Перед тобой 15 образцов парфюма. и небольшое приложение для удобного
        знакомства с ними. Вдыхай запахи, чувствуй эмоции, запоминай ощущения.
        Данные будут сохранены персонально и при желании-необходимости выгружены
        в потребном формате. Приложение реализовано в рамках дополнения к
        подарку и с целью обкатывания на подопытном тебе.
        <span style={{ color: "green" }}>добавить разворачивающуюся часть</span>
      </div>
      <Form method="post">
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Загрузка..." : "Начать затест"}
        </button>
      </Form>
    </>
  );
}
