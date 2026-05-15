"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { operatorSignup, selectOperatorAuth } from "@/store/operatorAuthSlice";

export function useOperatorSignup() {

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector(selectOperatorAuth);

  const signup = async (payload) => {

    const action = await dispatch(operatorSignup(payload));

    if (action.meta.requestStatus === "fulfilled") {
      router.replace("/operator/login");
    }

    return action;
  };

  return { signup, loading, error };
}