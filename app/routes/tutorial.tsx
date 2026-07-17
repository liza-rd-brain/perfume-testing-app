import { Form, redirect, useNavigation } from "react-router";

import styles from "./route.module.css";
import { useRef, useState, type DetailedHTMLProps } from "react";
import { createUserDoneTutorial } from "~/lib/session.server";

// ✅ Серверный код в action
export async function action() {
  // Импортируем функцию ТОЛЬКО здесь, внутри action

  //тут рисовать прелоадер
  await createUserDoneTutorial("/");

  return redirect("/");
}

// ✅ Проверяем куку при загрузке страницы
export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");

  // Если кука tutorial_done есть - редирект на главную
  if (cookieHeader?.includes("tutorialSkipped=true")) {
    return redirect("/");
  }

  return null;
}

export default function Tutorial() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [open, setOpen] = useState(false);
  const openDetail = useRef<HTMLDetailsElement>(null);

  const changeOpen = (e: React.MouseEvent<HTMLDetailsElement, MouseEvent>) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  };

  return (
    <div className={styles["page-layout"]}>
      <h2 className={styles.title}>Слепой парфюмерный затест</h2>
      <div className={styles.text}>
        Перед тобой 15 образцов парфюма и небольшое приложение для удобного
        знакомства с ними. <br />
        <br />
        Вдыхай запахи, чувствуй эмоции, запоминай ощущения.
        <br /> Данные будут сохранены персонально и при желании-необходимости
        выгружены в потребном формате.
        <br />
        Приложение реализовано в рамках дополнения к подарку и с целью
        обкатывания на подопытном тебе.
        {/* <span style={{ color: "green" }}>добавить разворачивающуюся часть</span> */}
      </div>
      <details
        className={styles.details}
        ref={openDetail}
        open={open}
        onClick={changeOpen}
      >
        <summary>
          Инструкция
          <p className={styles["sub-text"]}>
            {open ? "(закрыть)" : "(открыть)"}
          </p>
        </summary>
        <p>
          Выбирай парфюм по номеру или рандомно.
          <br />
          Номер каждого парфюма указан на этикетке.
          <br /> Нужно (можно) выбрать ноты: верхние,средние, база.
          <br /> Так же можно записать свои впечатления и заметки. В каждом
          парфюме будет кнопка посмотреть результаты.
          <br /> Ноты взяты по большей части с сайта fragrantica и могут быть
          неточными.
        </p>
      </details>
      <Form method="post" className={styles.bottom}>
        <button
          className={`${styles.button} ${styles.bottom}`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Загрузка..." : "Начать затест"}
        </button>
      </Form>
    </div>
  );
}
