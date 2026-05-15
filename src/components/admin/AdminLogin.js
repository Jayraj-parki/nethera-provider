"use client";

import { useState } from "react";
import styles from "./AdminLogin.module.scss";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "@/store/adminAuthSlice";



export default function AdminLogin() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.adminAuth);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(adminLogin(form));

    if (res.meta.requestStatus === "fulfilled") {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className={`container-fluid ${styles.Adminwrapper}`}>
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-4 col-lg-3">
          <div className={`card shadow ${styles.card}`}>
            <div className="card-body p-4">

              <h4 className={`text-center mb-3 ${styles.title}`}>
                Admin Login
              </h4>

              <p className="text-center text-muted mb-4">
                Sign in to manage dashboard
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control shadow-none outline-none border "
                    placeholder="admin@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control shadow-none outline-none border "
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* <div className="d-flex justify-content-between mb-3">
                  <a href="#" className="small text-decoration-none">
                    Forgot?
                  </a>
                </div> */}

                <button className={`btn w-100 text-light ${styles.loginBtn}`}>
                  Sign In
                </button>
              </form>

            </div>
          </div>

          <p className="text-center mt-3 small text-muted">
            © 2026 Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}