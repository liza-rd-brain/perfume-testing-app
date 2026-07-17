import { NavLink, useNavigate } from "react-router";
import styles from "./style.module.css";

export const ToIndexButton = () => {
  return (
    <NavLink className={styles.button} to={"/"}>
      в начало →
    </NavLink>
  );
};
