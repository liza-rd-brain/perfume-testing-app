import { Form, useActionData, redirect } from "react-router";

import { createUserSession, getUserId } from "~/lib/session.server";
import type { Route } from "./+types/login";
import { verifyPassword } from "../lib/session.server";
import styles from "./route.module.css";

export async function loader({ request }: Route.LoaderArgs) {
  // Если уже авторизован — на главную
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const password = formData.get("password")?.toString();

  if (!password) {
    return { error: "Введите пароль" };
  }

  // Проверяем пароль в Supabase
  const user = await verifyPassword(password);

  if (!user) {
    return { error: "Неверный пароль" };
  }

  const isTutorialDone = formData.get("tutorialSkipped")?.toString();

  if (!isTutorialDone) {
    // Создаём сессию и перенаправляем на tutorial
    return createUserSession(user.id, "/tutorial");
  } else {
    return createUserSession(user.id, "/");
  }
}

export default function Login() {
  const actionData = useActionData<{ error?: string }>();

  return (
    <div className={styles["page-layout"]}>
      <img src="/perfume.gif" className={styles.img}></img>
      <Form method="post" className={styles["login-form"]}>
        <input type="password" name="password" placeholder="Пароль" autoFocus />
        {actionData?.error && <p className="error">{actionData.error}</p>}
        <button type="submit" className={styles.button}>
          Войти
        </button>
      </Form>
    </div>
  );
}
