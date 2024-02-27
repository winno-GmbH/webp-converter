import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import styles from "../page.module.css";

export default async function ProtectedRoute() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className={styles.page}>
      <h1>Forms Pro Managment</h1>
      <br />
      Here you'll be able to manage forms and requests.
    </div>
  );
}
