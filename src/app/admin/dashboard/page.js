"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import OnboardOperator from "@/components/admin/OnboardOperator";
import OperatorList from "@/components/admin/OperatorList";
// import useProtectedRoute from "@/hooks/useProtectedRoute";

export default function Dashboard() {
  // useProtectedRoute()
  const [activeTab, setActiveTab] = useState("onboard");

  return (
    <div className="d-flex">
      <AdminSidebar setActiveTab={setActiveTab} />

      <div className="flex-grow-1 ms-2">
        {activeTab === "onboard" && <OnboardOperator />}
        {activeTab === "list" && <OperatorList />}
      </div>
    </div>
  );
}