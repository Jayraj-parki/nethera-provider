
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { nav_links } from "@/utils/constants";
import { selectOperatorAuth } from "@/store/operatorAuthSlice";

export default function useProtectedRoute() {
  const router = useRouter();

  const { status } = useSelector(selectOperatorAuth);

  useEffect(() => {
    if (status !== "authenticated") {
      router.replace(nav_links.login);
    }
  }, [status, router]);
}