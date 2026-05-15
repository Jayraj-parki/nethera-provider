"use client";

import { useEffect, useMemo, useState } from "react";
import { useOperatorLogin } from "@/hooks/useOperatorLogin";
import styles from "./operatorLogin.module.scss";


export default function OperatorLogin() {
    
    const { login, loading, error: authError } = useOperatorLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [touched, setTouched] = useState({ email: false, password: false });
    const [localError, setLocalError] = useState("");

    const emailErr = useMemo(() => {
        if (!touched.email) return "";
        if (!email.trim()) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
        return "";
    }, [email, touched.email]);

    const passErr = useMemo(() => {
        if (!touched.password) return "";
        if (!password) return "Password is required";
        return "";
    }, [password, touched.password]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        setLocalError("");
        if (emailErr || passErr) return;
        const res = await login({ email: email.trim(), password });
        if (res.meta.requestStatus === "rejected") {
            setLocalError(
                res.payload?.message || res.error?.message || "Unable to sign in. Please try again."
            );
        }
    };

    useEffect(() => {
        if (authError) setLocalError(authError);
    }, [authError]);

    return (
        <div className={styles.shell}>
            {/* Left hero */}
            <div className={styles.leftPane}>
                <div className={styles.overlay}>
                    <div className={styles.brandRow}>
                        <i className="bi bi-bus-front"></i>
                        <span>Operator Portal</span>
                    </div>
                    <div className={styles.tagline}>Manage your bus fleet efficiently</div>
                </div>
            </div>

            {/* Right form card */}
            <div className={styles.rightPane}>
                <div className={styles.card}>
                    <button
                        type="button"
                        className={styles.backLink}
                        onClick={() => (window.location.href = "/signin")}
                    >
                        <i className="bi bi-arrow-left"></i> Back to Main Login
                    </button>

                    <h5 className="mb-1 text-center">Welcome Back</h5>
                    <div className="text-muted text-center mb-3">Sign in to your operator account</div>

                    <form onSubmit={onSubmit} noValidate>
                        <label className={styles.label}>Email Address</label>
                        <div className={styles.inputIconRow + (emailErr ? " " + styles.error : "")}>
                            <i className="bi bi-person"></i>
                            <input
                                className="text-dark"
                                type="email"
                                placeholder="operator@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                            />
                        </div>
                        {emailErr && <div className={styles.errText}>{emailErr}</div>}

                        <label className={styles.label}>Password</label>
                        <div className={styles.inputIconRow + (passErr ? " " + styles.error : "")}>
                            <i className="bi bi-lock"></i>
                            <input
                                className="text-dark"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                            />
                        </div>
                        {/* <div className="text-center mt-3">
                            Don't have an account?{" "}
                            <a href="/operator/signup" className={styles.link}>
                                Sign Up
                            </a>
                        </div> */}
                        {passErr && <div className={styles.errText}>{passErr}</div>}

                        {localError && <div className={styles.formError}>{localError}</div>}

                        <button
                            type="submit"
                            className={styles.primaryBtn}
                            disabled={loading || !!emailErr || !!passErr}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className={styles.footerRow}>
                        <div className="text-muted">
                            Forgot your password?{" "}
                            <a href="/operator/reset" className={styles.link}>
                                Reset here
                            </a>
                        </div>
                    </div>

                    {/* <div className="text-center small text-muted mt-2">
                        Need help? Contact support at <a className={styles.link} href="mailto:support@netheraoperator.com">support@busoperator.com</a>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
