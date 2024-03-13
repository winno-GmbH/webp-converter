"use client";

import styles from "./page.module.css";

import { useFormStatus } from "react-dom";

export default function CompanyFormSubmit() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.submitBtn} disabled={pending} type="submit">
      {pending ? "Updating Data..." : "Save Company"}
    </button>
  );
}
