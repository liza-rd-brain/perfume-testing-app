import { useNavigate } from "react-router";
import styles from "./style.module.css";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button className={styles.button} onClick={() => navigate(-1)}>
      ←
    </button>
  );
};
