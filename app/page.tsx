import styles from "./page.module.css";
import Head from "next/head";

export default async function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <h1>Welcome to Winno Web Tools Platform</h1>
      </div>
    </main>
  );
}
