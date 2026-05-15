"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

import {
  restore,
  clear,
} from "@/store/operatorAuthSlice";

import { getItem, removeItem } from "@/utils/storage";


import { nav_links } from "@/utils/constants";
import { isTokenExpired } from "@/services/operatorAuthApi";

const AUTH_KEY = "op-auth:v1";
const ACCESS_KEY = "op:access";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);

  useEffect(() => {

    const publicRoutes = [
      nav_links.login
    ];

    const isPublic =
      publicRoutes.includes(pathname);

    const authData = getItem(AUTH_KEY);
   
    // no auth
    if (!authData?.token) {
   
      dispatch(clear());

      if (!isPublic) {
        router.replace(nav_links.login);
        return;
      }

      setReady(true);
      return;
    }

    // expired token
    if (isTokenExpired(authData.token)) {

      removeItem(AUTH_KEY);
      removeItem(ACCESS_KEY);

      dispatch(clear());

      router.replace(nav_links.login);

      return;
    }

    // restore redux
    dispatch(restore(authData));
  
    // logged in user on login page
    if (
      pathname === nav_links.login
    ) {
      router.replace(nav_links.dashboard);
      return;
    }

    setReady(true);

  }, [pathname, router, dispatch]);

  // BLOCK ENTIRE APP
  if (!ready) {
    return null;
  }

  return children;
}