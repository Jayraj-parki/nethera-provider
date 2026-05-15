"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { clear, selectOperatorAuth } from "@/store/operatorAuthSlice";
import { isTokenExpired } from "@/services/operatorAuthApi";
import { getItem, removeItem } from "@/utils/storage";
import { nav_links } from "@/utils/constants";
// import useProtectedRoute from "@/hooks/useProtectedRoute";

const AUTH_KEY = "op-auth:v1";
const ACCESS_KEY = "op:access";

export default function AuthGuard({ children }) {
    
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [checking, setChecking] = useState(true); // <<< IMPORTANT

  useEffect(() => {
    const run = () => {
      const publicRoutes = [
        nav_links["login"],
      ];

      const isPublic = publicRoutes.includes(pathname);

      const authData = getItem(AUTH_KEY);

      // no token
      if (!authData?.token) {
        if (!isPublic) {
          router.replace(nav_links["login"]);
        }
        setChecking(false);
        return;
      }

      // token expired
      if (isTokenExpired(authData.token)) {
        removeItem(AUTH_KEY);
        removeItem(ACCESS_KEY);
        dispatch(clear());
        router.replace(nav_links["login"]);
        setChecking(false);
        return;
      }

      setChecking(false);
    };

    run();
  }, [pathname, router, dispatch]);

  // 🔥 BLOCK UI UNTIL CHECK DONE
  if (checking) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return children;
}