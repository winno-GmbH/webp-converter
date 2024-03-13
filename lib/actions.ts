"use server";

import { saveCompany } from "./companies";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ICompany } from "@/interfaces/forms";

function isInvalidText(text: string) {
  return !text || text.trim() === "";
}

export async function updateCompany(prevState: any, formData: any) {
  const company: ICompany = {
    _id: formData.get("id"),
    name: formData.get("name"),
    companyMail: formData.get("companyMail"),
    country: formData.get("country"),
    googleSheets: formData.get("googleSheets"),
    headerText: formData.get("headerText"),
    footerText: formData.get("footerText"),
    bgColor: formData.get("bgColor"),
    bgColor2: formData.get("bgColor2"),
  };

  if (isInvalidText(company.name) || isInvalidText(company.companyMail) || !company.companyMail.includes("@")) {
    return { message: "Invalid Data Input" };
    // throw new Error("Invalid input");
  }

  //   console.log("Company", company);

  const response = await saveCompany(company);

  //   console.log(response);

  //   return { message: "Updated Successfully" };

  //   revalidatePath("/forms");
  redirect("/forms/" + formData.get("id"));
}
