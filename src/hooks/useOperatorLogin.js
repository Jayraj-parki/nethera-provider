"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { operatorLogin, selectOperatorAuth } from "@/store/operatorAuthSlice";
import { nav_links } from "@/utils/constants";

export function useOperatorLogin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector(selectOperatorAuth);

  const login = async (payload) => {
    const action = await dispatch(operatorLogin(payload));
    if (action.meta.requestStatus === "fulfilled") {
      router.replace(nav_links.dashboard);
      
    }
    return action;
  };

  return { login, loading, error };
}
