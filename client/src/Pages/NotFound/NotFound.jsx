import { Link } from "react-router-dom";
import styles from "./Notfound.module.css";

const NotFound = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>

        <h2 className={styles.title}>Page Not Found</h2>

        <p className={styles.text}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>
            Go to Homepage
          </Link>

          <button
            className={styles.secondaryBtn}
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
