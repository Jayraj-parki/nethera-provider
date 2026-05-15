"use client";

import { useState } from "react";
import styles from "./operatorLogin.module.scss";
import { useOperatorSignup } from "@/hooks/useOperatorSignup";
import { useOperatorLogin } from "@/hooks/useOperatorLogin";


export default function OperatorSignup() {
    const { login } = useOperatorLogin();
    const { signup, loading, error } = useOperatorSignup();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        id_proof_type: "",
        id_number: "",
        password: "",
        role: "",
        status: "Active",
        is_guest: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const action = await signup({
            name: form.name,
            email: form.email,
            phone: form.phone,
            age: form.age,
            id_proof_type: form.id_proof_type,
            id_number: form.id_number,
            password: form.password,
            role: form.role,
            status: form.status.toLowerCase(),
            is_guest: form.is_guest
        });

        // if signup success → login
        if (action.meta.requestStatus === "fulfilled") {
            await login({
                email: form.email,
                password: form.password,
            });
        }
    };

    return (
        <div className={styles.shell}>

            {/* LEFT SIDE */}
            <div className={styles.leftPane}>
                <div className={styles.overlay}>
                    <div className={styles.brandRow}>
                        <i className="bi bi-bus-front"></i>
                        <span>Operator Portal</span>
                    </div>
                    <div className={styles.tagline}>
                        Create your operator account
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className={styles.rightPane}>
                <div className={styles.card}>

                    <button
                        className={styles.backLink}
                        onClick={() => (window.location.href = "/operator/login")}
                    >
                        <i className="bi bi-arrow-left"></i> Back to Login
                    </button>

                    <h5 className="text-center mb-3">Create Operator Account</h5>

                    <form onSubmit={handleSubmit}>

                        {/* NAME */}
                        <label className={styles.label}>Name</label>
                        <div className={styles.inputIconRow}>
                            <i className="bi bi-person"></i>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* EMAIL */}
                        <label className={styles.label}>Email</label>
                        <div className={styles.inputIconRow}>
                            <i className="bi bi-envelope"></i>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* PHONE */}
                        <label className={styles.label}>Phone</label>
                        <div className={styles.inputIconRow}>
                            <i className="bi bi-telephone"></i>
                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>

                        {/* AGE */}
                        <label className={styles.label}>Age</label>
                        <div className={styles.inputIconRow}>
                            <i className="bi bi-calendar"></i>
                            <input
                                type="number"
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                            />
                        </div>

                        {/* ID PROOF TYPE */}
                        <label className={styles.label}>ID Proof Type</label>
                        <div className={styles.inputIconRow}>
                            <i className="bi bi-card-text"></i>
                            <input
                                type="text"
                                name="id_proof_type"
                                value={form.id_proof_type}
                                onChange={handleChange}
                            />
                        </div>

                        {/* ID NUMBER */}
                        <label className={styles.label}>ID Number</label>
                        <div className={styles.inputIconRow}>
                            <i className="bi bi-credit-card"></i>
                            <input
                                type="text"
                                name="id_number"
                                value={form.id_number}
                                onChange={handleChange}
                            />
                        </div>

                        {/* PASSWORD */}
                        <label className={styles.label}>Password</label>
                        <div className={styles.inputIconRow}>
                            <i className="bi bi-lock"></i>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* ROLE */}
                        <label className={styles.label}>Role</label>
                        <div className={styles.inputIconRow}>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                style={{ border: "none", width: "100%", background: "transparent" }}
                            >
                                <option value="">Select Role</option>
                                <option value="operator">Operator</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* STATUS */}
                        <label className={styles.label}>Status</label>
                        <div className={styles.inputIconRow}>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                style={{ border: "none", width: "100%", background: "transparent" }}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        {/* GUEST */}
                        <div style={{ marginTop: "10px" }}>
                            <input
                                type="checkbox"
                                name="is_guest"
                                checked={form.is_guest}
                                onChange={handleChange}
                            />{" "}
                            Is Guest
                        </div>

                        <button className={styles.primaryBtn} type="submit">
                            Create Account
                        </button>

                    </form>

                    <div className="text-center mt-3">
                        Already have an account?{" "}
                        <a href="/operator/login" className={styles.link}>
                            Sign In
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}