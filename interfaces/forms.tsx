import { ObjectId } from "mongodb";

export interface ICompany {
  _id: ObjectId;
  name: string;
  companyMail: string;
  country: string;
  googleSheets: string;
  headerText: string;
  footerText: string;
  bgColor: string;
  bgColor2: string;
  // Add more properties as needed
}
