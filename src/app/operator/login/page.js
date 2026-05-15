"use client";
import OperatorLogin from "@/components/auth/OperatorLogin";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function Page() {
  useAuthRedirect();
  return <OperatorLogin />;
}
