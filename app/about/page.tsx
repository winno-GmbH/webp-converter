import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import styles from "../page.module.css";

export default async function Page() {
  return (
    <div className={styles.page}>
      <h1>About Our Project</h1>
      <br />
      {/* Here you&apos;ll be able to read all interesting info about this cool project. */}
    </div>
  );
}
