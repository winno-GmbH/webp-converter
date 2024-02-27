import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";

import SessionProvider from "./components/SessionProvider";
import NavMenu from "./components/NavMenu/NavMenu";
import styles from "./page.module.css";
import Footer from "./components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gecko Web Tools",
  description: "Created by Winno Studio",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <SessionProvider session={session}>
          <NavMenu />
          <main className={styles.main}>{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
