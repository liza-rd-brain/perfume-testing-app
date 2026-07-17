import { useNavigate } from "react-router";
import styles from "./style.module.css";

export const ForwardButton = () => {
  const navigate = useNavigate();

  return (
    <button className={styles.button} onClick={() => navigate(-1)}>
      на главный
    </button>
  );
};
