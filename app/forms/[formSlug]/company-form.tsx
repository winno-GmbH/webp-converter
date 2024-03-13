"use client";

import { useFormState } from "react-dom";
import CompanyFormSubmit from "./company-form-submit";
import styles from "./page.module.css";
import { updateCompany } from "@/lib/actions";
import { ICompany } from "@/interfaces/forms";
import { useFormStatus } from "react-dom";

const CompanyForm: React.FC<{ company: ICompany | null }> = ({ company }) => {
  const [state, formAction] = useFormState(updateCompany, { message: "" });

  const status = useFormStatus();
  //   console.log("Status", status);

  return (
    <div>
      <h1>Company Details Page</h1>
      <div className={styles.form}>
        <form action={formAction}>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input type="text" id="name" name="name" required defaultValue={company?.name} />
          </div>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input type="email" id="companyMail" name="companyMail" required defaultValue={company?.companyMail} />
          </div>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="country">
              Country
            </label>
            <input type="text" id="country" name="country" defaultValue={company?.country} />
          </div>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="googleSheets">
              Google Sheets
            </label>
            <input type="text" id="googleSheets" name="googleSheets" defaultValue={company?.googleSheets} />
          </div>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="headerText">
              HeaderText
            </label>
            <textarea id="headerText" name="headerText" rows={7} defaultValue={company?.headerText}></textarea>
          </div>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="footerText">
              FooterText
            </label>
            <textarea id="footerText" name="footerText" rows={7} defaultValue={company?.footerText}></textarea>
          </div>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="bgColor">
              <span style={{ backgroundColor: company?.bgColor, padding: ".25em", display: "block" }}>BgColor</span>
            </label>
            <input type="text" id="bgColor" name="bgColor" defaultValue={company?.bgColor} />
          </div>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="bgColor2">
              <span style={{ backgroundColor: company?.bgColor2, padding: ".25em", display: "block" }}>BgColor2</span>
            </label>
            <input type="text" id="bgColor2" name="bgColor2" defaultValue={company?.bgColor2} />
          </div>
          <input type="hidden" id="id" name="id" defaultValue={company?._id.toString()} />

          <div className={styles.actions}>
            {/* <button type="submit">{isPending ? "Share Meal" : "Submitting..."}</button> */}
            {state?.message && <span>{state.message}</span>}
            <CompanyFormSubmit />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
