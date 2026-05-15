"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ResetPassword.module.scss";

export default function ResetPassword() {
  const router = useRouter();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 🔥 Replace with your API
      const res = await fetch("http://127.0.0.1:8000/reset-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_TOKEN",
        },
        body: JSON.stringify({
          new_password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password updated successfully ✅");
        router.push("/operator/dashboard");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container-fluid  ${styles.wrapper}`}>
      <div className="row justify-content-center  align-items-center h-100 ">
        <div className="col-md-4">
          <div className="card shadow p-4 border-0">
            <h4 className="text-center mb-3">Reset Password</h4>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                name="password"
                className="form-control shadow-none mb-3"
                placeholder="New Password"
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="confirmPassword"
                className="form-control shadow-none mb-3"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
              />

              <button
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}