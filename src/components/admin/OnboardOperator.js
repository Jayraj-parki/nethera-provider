"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onboardOperator } from "@/store/adminAuthSlice";

export default function OnboardOperator() {
  const dispatch = useDispatch();

  const { onboardResult, loading, error } = useSelector(
    (s) => s.adminAuth || {}
  );

  const [form, setForm] = useState({
    operator_name: "",
    operator_email: "",
    operator_phone: "",
    contact_name: "",
    contact_info: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(onboardOperator(form));

    if (res.meta.requestStatus === "fulfilled") {
      console.log("Operator created");
    }
  };

  return (
    <div className="card p-4 border-0 shadow-none">
      <h5 className="mb-3">Onboard Operator</h5>

      <form onSubmit={handleSubmit}>
        <input name="operator_name" className="form-control mb-2" placeholder="Operator Name" onChange={handleChange} />
        <input name="operator_email" className="form-control mb-2" placeholder="Email" onChange={handleChange} />
        <input name="operator_phone" className="form-control mb-2" placeholder="Phone" onChange={handleChange} />
        <input name="contact_name" className="form-control mb-2" placeholder="Contact Name" onChange={handleChange} />
        <input name="contact_info" className="form-control mb-3" placeholder="Contact Info" onChange={handleChange} />

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Creating..." : "Create Operator"}
        </button>
      </form>

      {/* ❌ Error */}
      {error && (
        <div className="alert alert-danger mt-3">{error}</div>
      )}

      {/* ✅ Success */}
      {onboardResult?.data && (
        <div className="alert alert-success mt-3">
          <h6>Operator Created ✅</h6>
          <p><b>Email:</b> {onboardResult.data.operator_user.email}</p>
          <p><b>Password:</b> {onboardResult.data.temporary_password}</p>
        </div>
      )}
    </div>
  );
}