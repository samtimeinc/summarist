import Link from "next/link";
import styles from "../styles/not-found.module.css";
import WarningSVG from "@/components/WarningSVG";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <figure className={styles.image}>
            <WarningSVG />
        </figure>
        {/* <h1 className={styles.title}>404</h1> */}
        <div className={styles.divider}></div>
        <h2 className={styles.subtitle}>Oops! Page not found.</h2>
        <p className={styles.description}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/for-you" className={styles.button}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}