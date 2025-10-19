"use client";

import { useEffect, useRef } from "react";
import styles from "./driver.module.scss";

export default function DriverDetailsModal({ driver, onClose, onEdit, onAssign }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        function handleOutside(e) {
            if (dialogRef.current && !dialogRef.current.contains(e.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [onClose]);
    return (
        <div className={styles.modalOverlay} onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={styles.modalDialog} ref={dialogRef}>
                <button className={styles.modalClose} onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>

                <h6 className="mb-3">Driver Details</h6>

                <div className="d-flex align-items-center gap-3 mb-3">
                    <div className={styles.avatarLg}>{driver.avatarInitial}</div>
                    <div>
                        <div className="fw-semibold">{driver.name}</div>
                        <div className="d-flex gap-2">
                            <span className={styles.badge + " bg-success-subtle text-success"}>Active</span>
                            <span className={styles.badge + " bg-purple text-white"}>Expert</span>
                        </div>
                    </div>
                </div>

                <div className="row g-3 small">
                    <div className="col-md-6">
                        <div className="text-muted mb-1">Contact Information</div>
                        <div className="d-flex align-items-center gap-2"><i className="bi bi-telephone"></i>{driver.phone}</div>
                        <div className="d-flex align-items-center gap-2"><i className="bi bi-envelope"></i>{driver.email}</div>
                    </div>
                    <div className="col-md-6">
                        <div className="text-muted mb-1">Professional Details</div>
                        <div className="d-flex align-items-center gap-2"><i className="bi bi-card-text"></i>License: {driver.license}</div>
                        <div className="d-flex align-items-center gap-2"><i className="bi bi-briefcase"></i>{driver.experienceYears} years experience</div>
                    </div>
                </div>

                <hr className="my-3" />

                <div className="d-flex justify-content-start gap-2">
                    <button className="btn btn-light" onClick={onEdit}>
                        <i className="bi bi-pencil-square me-1"></i> Edit Driver
                    </button>
                    <button className="btn btn-outline-primary" onClick={onAssign}>
                        Assign Bus
                    </button>
                </div>
            </div>
        </div>
    );
}
