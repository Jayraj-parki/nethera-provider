
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectOperatorAuth } from "@/store/operatorAuthSlice";
import { nav_links } from "@/utils/constants";

export default function useAuthRedirect() {
  const router = useRouter();

  const { status } = useSelector(selectOperatorAuth);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(nav_links.dashboard);
    }
  }, [status, router]);
}