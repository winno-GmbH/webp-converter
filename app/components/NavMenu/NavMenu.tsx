"use client";
import Link from "next/link";
import { clsx } from "clsx";
import { useSession, signOut, signIn } from "next-auth/react";

import classes from "./NavMenu.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NavMenu = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // console.log(loading);

  const pathname = usePathname();
  // console.log(pathname);

  function logoutHandler() {
    signOut({ redirect: true });
  }

  function AuthButton() {
    if (session) {
      // console.log(session?.user);
      // console.log(status);
      let avatar = "nophoto2.jpg";
      let userName = "noname";
      if (session?.user?.image) {
        avatar = session.user.image;
        // console.log(avatar);
      }
      if (session?.user?.name) {
        userName = session.user.name;
        // console.log(userName);
      }
      return (
        <div className={classes.auth__button}>
          {/* <Image src="https://avatars.githubusercontent.com/u/151785355?v=4" alt="alt" width={50} height={50} />
          {session?.user && session.user?.name} */}
          {session?.user && session.user?.email}
          <button onClick={logoutHandler}>Sign out</button>
        </div>
      );
    } else {
      return (
        <div className={classes.auth__button}>
          <button onClick={() => signIn()}>Login</button>
        </div>
      );
    }
  }
  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>
          <p>
            DASH<span>board</span>
          </p>
        </div>
      </Link>
      <nav>
        <ul className={classes.navmenu}>
          <li className={clsx({ [classes.active_link]: pathname === "/about" })}>
            {/* <li> */}
            <Link href="/about">About</Link>
          </li>
          <li className={clsx({ [classes.active_link]: pathname === "/converter" })}>
            <Link href="/converter">Dev Image Converter</Link>
          </li>
          {session && (
            <>
              {/* <li className={clsx({ [classes.active_link]: pathname === "/dashboard" })}>
                <Link href="/dashboard">Dashboard</Link> 
              </li>*/}

              <li className={clsx({ [classes.active_link]: pathname === "/converter" })}>
                <Link href="/converter">Image Converter</Link>
              </li>
              <li className={clsx({ [classes.active_link]: pathname === "/forms" })}>
                <Link href="/forms">Form Tools</Link>
              </li>
              {/* <li className={clsx({ [classes.active_link]: pathname === "/audit" })}>
                <Link href="/audit">Site Audit</Link>
              </li> */}
            </>
          )}
          {/* {session && (
                        <li>
                            <Link href="/profile">Profile</Link>
                        </li>
                    )} */}
        </ul>
      </nav>
      <AuthButton />
    </header>
  );
};

export default NavMenu;
