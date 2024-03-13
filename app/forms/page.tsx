import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import styles from "../page.module.css";
import { getCompanies } from "@/lib/companies";
import Link from "next/link";

export default async function ProtectedRoute() {
  const session = await getServerSession();

  // if (!session || !session.user) {
  //   redirect("/api/auth/signin");
  // }

  const companies = await getCompanies();

  // console.log(companies);

  return (
    <div className={styles.page}>
      <h1>Forms Pro Managment</h1>
      <br />
      <h2>Our Clients</h2>
      <ul></ul>
      {companies.map((company) => (
        <li key={company._id.toString()}>
          <Link href={`/forms/${company._id.toString()}`}>{company.name}</Link>
        </li>
      ))}

      {/* Here you&apos;ll be able to manage forms and requests. */}
    </div>
  );
}
