import { ICompany } from "@/interfaces/forms";
import CompanyForm from "./company-form";
import styles from "./page.module.css";
import { notFound } from "next/navigation";

// export async function generateMetadata({ params }) {
//   // console.log(params.mealSlug);
//   const meal = await getMeal(params.mealSlug);
//   // console.log(meal.title);

import { getCompany } from "@/lib/companies";

interface CompanyDetailsParams {
  formSlug: string;
}

async function CompanyDetailsPage({ params }: { params: CompanyDetailsParams }) {
  const { formSlug } = params;

  if (!formSlug || formSlug === null) {
    console.log("Not found");
    return notFound();
    // return;
  }

  const company: ICompany | null = await getCompany(formSlug);
  // console.log(company);

  return (
    <>
      <main className={styles.company}>
        <CompanyForm company={company} />
        {/* <h2>{company?.name}</h2>
        <h4>{company?.companyMail}</h4>
        <h4>{company?.country}</h4>
        <p>
          <strong>HeaderText:</strong>
          {company?.headerText}
        </p>
        <p>
          <strong>FooterText:</strong>
          {company?.footerText}
        </p> */}
        {/* <br />
        <p style={{ backgroundColor: company?.bgColor, padding: "1em" }}>BgColor{company?.bgColor}</p>
        <p style={{ padding: "1em" }}>BgColor2{company?.bgColor2}</p> */}
      </main>
    </>
  );
}

export default CompanyDetailsPage;
