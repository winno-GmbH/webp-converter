import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import styles from "../page.module.css";
import { Metadata } from "next";
import MainConverter from "../components/MainConverter/MainConverter";

export const metadata: Metadata = {
  title: "Image Converter",
  description: "Winno Tools",
};

export default async function ProtectedRoute() {
  const session = await getServerSession();

  // if (!session || !session.user) {
  //   redirect("/api/auth/signin");
  // }

  return (
    <div className={styles.page}>
      {/* <h1>Fast & Furios Image Converter</h1>
      <br />
      <p>Here you'll be able to convert any jpg/png files to a WebP format.</p>
      <ol>
        <li>Upload images</li>
        <li>Configure settings</li>
        <li>Convert images</li>
        <li>Preview results</li>
        <li>Download images</li>
      </ol> */}
      <MainConverter />
    </div>
  );
}
