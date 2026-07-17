// app/components/ToIndexButton.tsx
import { NavLink } from "react-router";
import styles from "./style.module.css";

export const ToIndexButton = () => {
  return (
    <NavLink
      className={styles.button}
      to="/"
      state={{ refresh: Date.now() }} // ← Заставляет перерендерить
    >
      в начало →
    </NavLink>
  );
};
